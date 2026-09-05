import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'

export default async (req) => {
  const db = getDatabase()

  if (req.method === 'GET') {
    const products = await db.sql`
      SELECT
        p.id,
        p.name,
        p.description,
        p.amazon_link,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'image_key', pi.image_key,
              'display_order', pi.display_order
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
        p.name,
        p.description,
        p.amazon_link
      ORDER BY p.created_at DESC
    `

    return Response.json(products)
  }

  if (req.method === 'POST') {
    const formData = await req.formData()

    const productNumber = formData.get('productNumber')
    const name = formData.get('name')
    const description = formData.get('description')

    const amazonLinkValue = formData.get('amazonLink')
    const amazonLink = amazonLinkValue?.trim() || null

    const images = formData.getAll('image')

    if (!name) {
      return Response.json(
        { error: 'Product name is required.' },
        { status: 400 }
      )
    }

    const imageKeys = []

    if (images && images.length > 0) {
      const imageStore = getStore('product-images')

      for (const img of images) {
        const extension = img.name.split('.').pop()
        const key = `${crypto.randomUUID()}.${extension}`

        await imageStore.set(key, img)

        imageKeys.push(key)
      }
    }

    const products = await db.sql`
      INSERT INTO products (
        name,
        description,
        item_number,
        amazon_link
      )
      VALUES (
        ${name},
        ${description},
        ${productNumber},
        ${amazonLink}
      )
      RETURNING *
    `

    const product = products[0]

    if (imageKeys.length > 0) {
      for (const key of imageKeys) {
        await db.sql`
          INSERT INTO product_images (
            product_id,
            image_key
          )
          VALUES (
            ${product.id},
            ${key}
          )
        `
      }
    }

    return Response.json(product, {
      status: 201
    })
  }

  return Response.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  )
}