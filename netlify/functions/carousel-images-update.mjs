
import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'
import { verifyRequestOrigin } from '@netlify/identity'

import { requireAuth } from './utils/requireAuth.mjs'

// ========================================
// CONFIGURATION
// ========================================

const MAX_IMAGE_SIZE = 500 * 1024

const ALLOWED_IMAGE_TYPES = [
  'image/webp',
  'image/jpeg',
  'image/png'
]

const json = (data, status = 200) =>
  Response.json(data, { status })

const validId = (value) =>
  Number.isSafeInteger(Number(value)) &&
  Number(value) > 0

export default async (req) => {
  if (
    !['GET', 'POST', 'DELETE'].includes(req.method)
  ) {
    return json(
      { error: 'Method not allowed.' },
      405
    )
  }

  // ========================================
  // AUTHENTICATION / AUTHORIZATION
  // ========================================

  if (req.method !== 'GET') {
    const { response } = await requireAuth()

    if (response) {
      return response
    }

    try {
      verifyRequestOrigin(req)
    } catch {
      return json(
        { error: 'Request origin verification failed.' },
        403
      )
    }
  }

  try {
    const db = getDatabase()
    const url = new URL(req.url)

    // ========================================
    // GET - CAROUSEL IMAGES
    // ========================================

    if (req.method === 'GET') {
      const carouselItemId = Number(
        url.searchParams.get('carouselItemId')
      )

      if (!validId(carouselItemId)) {
        return json(
          { error: 'Valid carousel item ID is required.' },
          400
        )
      }

      const images = await db.sql`
        SELECT
          cimg.id,
          cimg.carousel_item_id,
          cimg.image_key,
          cimg.viewport_id,
          vd.name AS viewport

        FROM carousel_images cimg

        INNER JOIN viewport_display vd
          ON vd.id = cimg.viewport_id

        WHERE
          cimg.carousel_item_id = ${carouselItemId}

        ORDER BY cimg.viewport_id ASC
      `

      return json(images)
    }

    // ========================================
    // POST - UPLOAD / REPLACE IMAGE
    // ========================================

    if (req.method === 'POST') {
      const formData = await req.formData()

      const carouselItemId = Number(
        formData.get('carouselItemId')
      )

      const viewportId = Number(
        formData.get('viewportId')
      )

      const image = formData.get('image')

      if (
        !validId(carouselItemId) ||
        !validId(viewportId)
      ) {
        return json(
          { error: 'Invalid carousel item or viewport.' },
          400
        )
      }

      if (!image || typeof image.arrayBuffer !== 'function') {
        return json(
          { error: 'An image file is required.' },
          400
        )
      }

      // Validate image size.

      if (image.size > MAX_IMAGE_SIZE) {
        return json(
          {
            error:
              'Image exceeds the 500 KB limit.'
          },
          400
        )
      }

      if (image.size === 0) {
        return json(
          { error: 'Image cannot be empty.' },
          400
        )
      }

      // Validate image type.

      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return json(
          {
            error:
              'Only WebP, JPG, and PNG images are allowed.'
          },
          400
        )
      }

      // Verify carousel item exists.

      const carouselItems = await db.sql`
        SELECT id
        FROM carousel_items
        WHERE id = ${carouselItemId}
      `

      if (!carouselItems.length) {
        return json(
          { error: 'Carousel item not found.' },
          404
        )
      }

      // Verify viewport exists.

      const viewports = await db.sql`
        SELECT id
        FROM viewport_display
        WHERE id = ${viewportId}
      `

      if (!viewports.length) {
        return json(
          { error: 'Invalid viewport selection.' },
          400
        )
      }

      // Find an existing image for this viewport.

      const existingImages = await db.sql`
        SELECT id, image_key
        FROM carousel_images
        WHERE
          carousel_item_id = ${carouselItemId}
          AND viewport_id = ${viewportId}
      `

      const existingImage = existingImages[0]

      // ========================================
      // UPLOAD NEW BLOB
      // ========================================

      const imageStore = getStore('carousel-images')

      const extension =
        image.type === 'image/webp'
          ? 'webp'
          : image.type === 'image/png'
            ? 'png'
            : 'jpg'

      const imageKey =
        `${crypto.randomUUID()}.${extension}`

      await imageStore.set(
        imageKey,
        await image.arrayBuffer(),
        {
          metadata: {
            contentType: image.type
          }
        }
      )

      // ========================================
      // UPDATE DATABASE
      // ========================================

      let savedImage

      try {
        const result = await db.sql`
          INSERT INTO carousel_images (
            carousel_item_id,
            image_key,
            viewport_id
          )
          VALUES (
            ${carouselItemId},
            ${imageKey},
            ${viewportId}
          )

          ON CONFLICT (
            carousel_item_id,
            viewport_id
          )

          DO UPDATE SET
            image_key = EXCLUDED.image_key

          RETURNING *
        `

        savedImage = result[0]
      } catch (error) {
        // Remove the newly uploaded blob if DB fails.
        await imageStore.delete(imageKey).catch(
          (cleanupError) => {
            console.error(
              'Failed to clean up new carousel blob:',
              cleanupError
            )
          }
        )

        throw error
      }

      // ========================================
      // CLEAN UP PREVIOUS IMAGE
      // ========================================

      if (
        existingImage &&
        existingImage.image_key !== imageKey
      ) {
        try {
          await imageStore.delete(
            existingImage.image_key
          )
        } catch (error) {
          console.error(
            'Failed to delete old carousel image:',
            error
          )
        }
      }

      return json({
        message: existingImage
          ? 'Carousel image replaced successfully.'
          : 'Carousel image uploaded successfully.',

        image: savedImage
      }, existingImage ? 200 : 201)
    }

    // ========================================
    // DELETE - REMOVE INDIVIDUAL IMAGE
    // ========================================

    if (req.method === 'DELETE') {
      const body = await req.json()
      const imageId = Number(body.imageId)

      if (!validId(imageId)) {
        return json(
          { error: 'Valid image ID is required.' },
          400
        )
      }

      const result = await db.sql`
        DELETE FROM carousel_images
        WHERE id = ${imageId}
        RETURNING image_key
      `

      if (!result.length) {
        return json(
          { error: 'Carousel image not found.' },
          404
        )
      }

      const imageStore = getStore('carousel-images')

      try {
        await imageStore.delete(result[0].image_key)
      } catch (error) {
        console.error(
          'Failed to delete carousel blob:',
          error
        )
      }

      return json({
        message: 'Carousel image deleted successfully.'
      })
    }
  } catch (error) {
    console.error('Carousel images update error:', error)

    return json(
      { error: 'An unexpected error occurred.' },
      500
    )
  }
}
