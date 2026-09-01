import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'
import { getUser } from '@netlify/identity'

export default async (req) => {
  const db = getDatabase()

  // ========================================
  // GET PRODUCTS
  // ========================================

  if (req.method === 'GET') {
  const products = await db.sql`
    SELECT
      p.id,
      p.item_number,
      p.name,
      p.description,
      p.brand_id,
      p.season_id,
      p.created_at,
      p.updated_at,

      COALESCE(
        json_agg(
          json_build_object(
            'id', pi.id,
            'product_id', pi.product_id,
            'image_key', pi.image_key,
            'display_order', pi.display_order,
            'created_at', pi.created_at
          )
          ORDER BY pi.display_order, pi.id
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'::json
      ) AS images

    FROM products p

    LEFT JOIN product_images pi
      ON pi.product_id = p.id

    GROUP BY
      p.id,
      p.item_number,
      p.name,
      p.description,
      p.brand_id,
      p.season_id,
      p.created_at,
      p.updated_at

    ORDER BY p.created_at DESC
  `

  return Response.json(products)
}

  // ========================================
  // ADD PRODUCT
  // ========================================

  if (req.method === 'POST') {
    const isDevAuthBypass =
      process.env.DEV_AUTH_BYPASS === 'true'

    if (!isDevAuthBypass) {
      const user = await getUser()

      if (!user) {
        return Response.json(
          { error: 'Unauthorized.' },
          { status: 401 }
        )
      }
    }

    const formData = await req.formData()

    const itemNumber = formData.get('item_number')
    const name = formData.get('name')
    const description = formData.get('description')

    const images = formData.getAll('images')

    // ========================================
    // VALIDATION
    // ========================================

    if (!itemNumber) {
      return Response.json(
        { error: 'Item number is required.' },
        { status: 400 }
      )
    }

    if (!name) {
      return Response.json(
        { error: 'Product name is required.' },
        { status: 400 }
      )
    }

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024

    for (const image of images) {
      if (image.size > MAX_IMAGE_SIZE) {
        return Response.json(
          {
            error: `${image.name} must be smaller than 5 MB.`
          },
          { status: 413 }
        )
      }
    }

    // ========================================
    // CREATE PRODUCT
    // ========================================

    const products = await db.sql`
      INSERT INTO products (
        item_number,
        name,
        description
      )
      VALUES (
        ${itemNumber},
        ${name},
        ${description}
      )
      RETURNING *
    `

    const product = products[0]

    // ========================================
    // SAVE PRODUCT IMAGES
    // ========================================

    const imageStore = getStore('product-images')

    const productImages = []

    for (const image of images) {
      if (!image || image.size === 0) {
        continue
      }

      const extension = image.name
        .split('.')
        .pop()
        .toLowerCase()

      const imageKey =
        `${crypto.randomUUID()}.${extension}`

      // Save actual file to Netlify Blobs
      await imageStore.set(
        imageKey,
        image
      )

      // Save relationship in database
      const savedImages = await db.sql`
        INSERT INTO product_images (
          product_id,
          image_key
        )
        VALUES (
          ${product.id},
          ${imageKey}
        )
        RETURNING *
      `

      productImages.push(savedImages[0])
    }

    // ========================================
    // RESPONSE
    // ========================================

    return Response.json(
      {
        ...product,
        images: productImages
      },
      { status: 201 }
    )
  }

  // ========================================
  // UNSUPPORTED METHOD
  // ========================================

  return Response.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  )
}