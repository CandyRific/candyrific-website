import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'

export default async (req) => {
  const db = getDatabase()

  if (req.method === 'GET') {
    const products = await db.sql`
      SELECT *
      FROM products
      ORDER BY created_at DESC
    `

    return Response.json(products)
  }

 if (req.method === 'POST') {
  const formData = await req.formData()

  const name = formData.get('name')
  const description = formData.get('description')
  const image = formData.get('image')

  if (!name) {
    return Response.json(
      { error: 'Product name is required.' },
      { status: 400 }
    )
  }

  let imageKey = null

  if (image && image.size > 0) {
    const imageStore = getStore('product-images')

    const extension = image.name.split('.').pop()
    imageKey = `${crypto.randomUUID()}.${extension}`

    await imageStore.set(imageKey, image)
  }

  const products = await db.sql`
    INSERT INTO products (
      name,
      description,
      image_key
    )
    VALUES (
      ${name},
      ${description},
      ${imageKey}
    )
    RETURNING *
  `

  return Response.json(products[0], {
    status: 201
  })
}

  return Response.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  )
}