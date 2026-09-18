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

  if (req.method === 'PATCH') {
  const formData =
    await req.formData()

  const brandId =
    formData.get('brandId')

  const image =
    formData.get('image')


  if (!brandId) {
    return Response.json(
      {
        error:
          'Brand ID is required.'
      },
      {
        status: 400
      }
    )
  }


  if (
    !image ||
    image.size === 0
  ) {
    return Response.json(
      {
        error:
          'A new brand image is required.'
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
        name,
        image_key
      FROM brands
      WHERE id = ${brandId}
      LIMIT 1
    `


  if (existingBrands.length === 0) {
    return Response.json(
      {
        error:
          'Brand not found.'
      },
      {
        status: 404
      }
    )
  }


  const existingBrand =
    existingBrands[0]

  const oldImageKey =
    existingBrand.image_key

  const imageStore =
    getStore('brand-images')


  const extension =
    image.name
      .split('.')
      .pop()

  const newImageKey =
    `${crypto.randomUUID()}.${extension}`


  /*
   * 1. Upload the new image first.
   */
  await imageStore.set(
    newImageKey,
    image
  )


  try {
    /*
     * 2. Point the database at
     *    the new image.
     */
    const updatedBrands =
      await db.sql`
        UPDATE brands
        SET image_key = ${newImageKey}
        WHERE id = ${brandId}
        RETURNING
          id,
          name,
          image_key,
          created_at
      `


    /*
     * 3. The database now points
     *    at the new image, so the
     *    old blob can be deleted.
     */
    if (oldImageKey) {
      await imageStore.delete(
        oldImageKey
      )
    }


    return Response.json(
      updatedBrands[0]
    )
  } catch (error) {
    /*
     * The DB update failed.
     *
     * Clean up the NEW blob because
     * nothing references it.
     */
    await imageStore.delete(
      newImageKey
    )

    throw error
  }
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