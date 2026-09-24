import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'

/* ========================================
   GET PRODUCT IMAGES
======================================== */

const getProductImages = async (
  db,
  productId
) => {
  return await db.sql`
    SELECT
      id,
      product_id,
      image_key,
      display_order
    FROM product_images
    WHERE product_id = ${productId}
    ORDER BY
      display_order ASC,
      id ASC
  `
}

/* ========================================
   FUNCTION
======================================== */

export default async (req) => {
  const db = getDatabase()

  /* ========================================
     GET
  ======================================== */

  if (req.method === 'GET') {
    try {
      const url = new URL(req.url)

      const productId =
        url.searchParams.get('productId')

      if (!productId) {
        return Response.json(
          {
            error:
              'Product ID is required.'
          },
          {
            status: 400
          }
        )
      }

      const images =
        await getProductImages(
          db,
          productId
        )

      return Response.json(images)
    } catch (error) {
      console.error(
        'Unable to load product images:',
        error
      )

      return Response.json(
        {
          error:
            error.message ||
            'Unable to load product images.'
        },
        {
          status: 500
        }
      )
    }
  }

  /* ========================================
     POST

     Add new images.
  ======================================== */

  if (req.method === 'POST') {
    const uploadedBlobKeys = []

    try {
      const formData =
        await req.formData()

      const productId =
        formData.get('productId')

      const images =
        formData.getAll('images')

      if (!productId) {
        return Response.json(
          {
            error:
              'Product ID is required.'
          },
          {
            status: 400
          }
        )
      }

      const validImages =
        images.filter(
          (image) =>
            image &&
            image.size > 0
        )

      if (validImages.length === 0) {
        const productImages =
          await getProductImages(
            db,
            productId
          )

        return Response.json({
          message:
            'No new images to add.',
          images: productImages
        })
      }

      /*
       * Find the current highest
       * display order.
       */
      const orderResult =
        await db.sql`
          SELECT
            COALESCE(
              MAX(display_order),
              0
            ) AS max_order
          FROM product_images
          WHERE product_id = ${productId}
        `

      let displayOrder =
        Number(
          orderResult[0]?.max_order ?? 0
        )

      const imageStore =
        getStore('product-images')

      for (
        const image of validImages
      ) {
        const originalExtension =
          image.name
            ?.split('.')
            .pop()
            ?.toLowerCase()

        const extension =
          originalExtension ||
          'webp'

        const imageKey =
          `${crypto.randomUUID()}.${extension}`

        /*
         * Upload blob first.
         */
        await imageStore.set(
          imageKey,
          image
        )

        uploadedBlobKeys.push(
          imageKey
        )

        displayOrder += 1

        /*
         * Then create DB relationship.
         */
        await db.sql`
          INSERT INTO product_images (
            product_id,
            image_key,
            display_order
          )
          VALUES (
            ${productId},
            ${imageKey},
            ${displayOrder}
          )
        `
      }

      const productImages =
        await getProductImages(
          db,
          productId
        )

      return Response.json(
        {
          message:
            'Images added successfully.',
          images: productImages
        },
        {
          status: 201
        }
      )
    } catch (error) {
      console.error(
        'Unable to add product images:',
        error
      )

      /*
       * Remove newly uploaded blobs
       * that aren't safe to leave around.
       */
      const imageStore =
        getStore('product-images')

      for (
        const imageKey
        of uploadedBlobKeys
      ) {
        try {
          await imageStore.delete(
            imageKey
          )
        } catch (cleanupError) {
          console.error(
            'Unable to clean up image blob:',
            cleanupError
          )
        }
      }

      return Response.json(
        {
          error:
            error.message ||
            'Unable to add product images.'
        },
        {
          status: 500
        }
      )
    }
  }

  /* ========================================
     DELETE

     Remove existing images.
  ======================================== */

  if (req.method === 'DELETE') {
    try {
      const body =
        await req.json()

      const productId =
        body.productId

      const imageIds =
        Array.isArray(body.imageIds)
          ? body.imageIds
          : []

      if (!productId) {
        return Response.json(
          {
            error:
              'Product ID is required.'
          },
          {
            status: 400
          }
        )
      }

      if (imageIds.length === 0) {
        const images =
          await getProductImages(
            db,
            productId
          )

        return Response.json({
          message:
            'No images needed to be removed.',
          images
        })
      }

      const imageStore =
        getStore('product-images')

      for (
        const imageId of imageIds
      ) {
        /*
         * Make sure this image belongs
         * to this product and get its
         * blob key before deleting it.
         */
        const imageRows =
          await db.sql`
            SELECT
              id,
              image_key
            FROM product_images
            WHERE id = ${imageId}
              AND product_id = ${productId}
            LIMIT 1
          `

        if (
          imageRows.length === 0
        ) {
          continue
        }

        const image =
          imageRows[0]

        /*
         * Remove DB record first.
         */
        await db.sql`
          DELETE FROM product_images
          WHERE id = ${imageId}
            AND product_id = ${productId}
        `

        /*
         * Then remove blob.
         */
        if (image.image_key) {
          try {
            await imageStore.delete(
              image.image_key
            )
          } catch (blobError) {
            console.error(
              'Database image removed, but blob cleanup failed:',
              blobError
            )
          }
        }
      }

      const images =
        await getProductImages(
          db,
          productId
        )

      return Response.json({
        message:
          'Images removed successfully.',
        images
      })
    } catch (error) {
      console.error(
        'Unable to remove product images:',
        error
      )

      return Response.json(
        {
          error:
            error.message ||
            'Unable to remove product images.'
        },
        {
          status: 500
        }
      )
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