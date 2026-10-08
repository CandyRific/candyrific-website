
import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'
import { verifyRequestOrigin } from '@netlify/identity'

import { requireAuth } from './utils/requireAuth.mjs'

export default async (req) => {

  /* ========================================
     GET ALL BRANDS (PUBLIC)
  ======================================== */

  if (req.method === 'GET') {
    const db = getDatabase()

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

  /* ========================================
     CREATE BRAND (ADMIN ONLY)
  ======================================== */

  if (req.method === 'POST') {

    /* ========================================
       AUTHORIZATION
    ======================================== */

    const { response } = await requireAuth()

    if (response) {
      return response
    }

    verifyRequestOrigin(req)

    const db = getDatabase()

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

  /* ========================================
     UPDATE BRAND IMAGE (ADMIN ONLY)
  ======================================== */

  if (req.method === 'PATCH') {

    /* ========================================
       AUTHORIZATION
    ======================================== */

    const { response } = await requireAuth()

    if (response) {
      return response
    }

    verifyRequestOrigin(req)

    const db = getDatabase()

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

    let updatedBrand

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

      updatedBrand =
        updatedBrands[0]

    } catch (error) {
      /*
       * The database update failed.
       * Remove the newly uploaded blob.
       */
      try {
        await imageStore.delete(
          newImageKey
        )
      } catch (cleanupError) {
        console.error(
          'Unable to clean up new brand image:',
          cleanupError
        )
      }

      throw error
    }

    /*
     * 3. The database now references
     *    the new image. Delete the old
     *    blob as a separate operation.
     */
    if (oldImageKey) {
      try {
        await imageStore.delete(
          oldImageKey
        )
      } catch (cleanupError) {
        console.error(
          'Brand image updated, but old blob cleanup failed:',
          cleanupError
        )
      }
    }

    return Response.json(
      updatedBrand
    )
  }

  /* ========================================
     METHOD NOT ALLOWED
  ======================================== */

  return Response.json(
    {
      error:
        'Method not allowed.'
    },
    {
      status: 405,
      headers: {
        Allow: 'GET, POST, PATCH'
      }
    }
  )
}
