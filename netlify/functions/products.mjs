import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'

export default async (req) => {
  const db = getDatabase()

  if (req.method === 'GET') {
    const products = await db.sql`
      SELECT
        p.id,
        p.name,
        p.description
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
        p.description
      ORDER BY p.created_at DESC
    `

    return Response.json(products)
  }

 if (req.method === 'POST') {
  const formData = await req.formData()

  const productNumber = formData.get('productNumber')
  const name = formData.get('name')
  const description = formData.get('description')

  const images = formData.getAll('image')

  if (!name) {
    return Response.json(
      { error: 'Product name is required.' },
      { status: 400 }
    )
  }

  let imageKeys = [] // don't think we'll need the image key anymore. Actually, we will, it'll just need to be an array of image keys instead of a single image key

  if (images && images.length > 0) { // Need to check images instead of image and loop through them to store each image in the blob store
    const imageStore = getStore('product-images')

    for (const img of images) {
      const extension = img.name.split('.').pop()
      const key = `${crypto.randomUUID()}.${extension}`
      await imageStore.set(key, img)
      imageKeys.push(key) // push the key to the array of image keys
    }
  }


  // We'll likely need to insert into the products database just the name and description, get the product id, and then insert into the product_images table
  const products = await db.sql`
    INSERT INTO products (
      name,
      description,
      product_number
    )
    VALUES (
      ${name},
      ${description},
      ${productNumber}
    )
    RETURNING *
  `
  let product = products[0];

  // Then we can insert into the product_images table for each image key
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

  return Response.json(products[0], {
    status: 201
  })
}

  return Response.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  )
}