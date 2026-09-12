import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'

export default async (req) => {
  const db = getDatabase()


  if (req.method === 'GET') {
    const brands = await db.sql`
      SELECT
        id,
        name,
        image_key,
        created_at
      FROM brands
      ORDER BY name ASC
    `

    return Response.json(brands)
  }


  if (req.method === 'POST') {
    const formData =
      await req.formData()

    const nameValue =
      formData.get('name')

    const name =
      nameValue?.trim()

    const image =
      formData.get('image')


    if (!name) {
      return Response.json(
        {
          error:
            'Brand name is required.'
        },
        {
          status: 400
        }
      )
    }


    const existingBrands =
      await db.sql`
        SELECT
          id,
          name
        FROM brands
        WHERE LOWER(name) = LOWER(${name})
        LIMIT 1
      `


    if (existingBrands.length > 0) {
      return Response.json(
        {
          error:
            'That brand already exists.'
        },
        {
          status: 409
        }
      )
    }


    let imageKey = null


    if (
      image &&
      image.size > 0
    ) {
      const imageStore =
        getStore('brand-images')

      const extension =
        image.name
          .split('.')
          .pop()

      imageKey =
        `${crypto.randomUUID()}.${extension}`

      await imageStore.set(
        imageKey,
        image
      )
    }


    const brands =
      await db.sql`
        INSERT INTO brands (
          name,
          image_key
        )
        VALUES (
          ${name},
          ${imageKey}
        )
        RETURNING
          id,
          name,
          image_key,
          created_at
      `


    return Response.json(
      brands[0],
      {
        status: 201
      }
    )
  }


  return Response.json(
    {
      error:
        'Method not allowed.'
    },
    {
      status: 405
    }
  )
}