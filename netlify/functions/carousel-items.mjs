
import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'
import { verifyRequestOrigin } from '@netlify/identity'

import { requireAuth } from './utils/requireAuth.mjs'

const json = (data, status = 200) =>
  Response.json(data, { status })

const validId = (value) =>
  Number.isSafeInteger(Number(value)) &&
  Number(value) > 0

export default async (req) => {
  const allowedMethods = [
    'GET',
    'POST',
    'PATCH',
    'DELETE'
  ]

  if (!allowedMethods.includes(req.method)) {
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
    // GET CAROUSEL ITEMS
    // ========================================

    if (req.method === 'GET') {
      const items = await db.sql`
        SELECT
          ci.id,
          ci.hyperlink,
          ci.display_order,
          ci.created_at,

          COALESCE(
            json_agg(
              json_build_object(
                'id', cimg.id,
                'image_key', cimg.image_key,
                'viewport_id', cimg.viewport_id,
                'viewport', vd.name
              )
              ORDER BY cimg.viewport_id
            ) FILTER (WHERE cimg.id IS NOT NULL),
            '[]'::json
          ) AS images

        FROM carousel_items ci

        LEFT JOIN carousel_images cimg
          ON cimg.carousel_item_id = ci.id

        LEFT JOIN viewport_display vd
          ON vd.id = cimg.viewport_id

        GROUP BY ci.id

        ORDER BY
          ci.display_order ASC,
          ci.id ASC
      `

      return json(items)
    }

    // ========================================
    // POST - CREATE CAROUSEL ITEM
    // ========================================

    if (req.method === 'POST') {
      const body = await req.json()

      const hyperlink =
        typeof body.hyperlink === 'string'
          ? body.hyperlink.trim() || null
          : null

      if (
        body.hyperlink != null &&
        typeof body.hyperlink !== 'string'
      ) {
        return json(
          { error: 'Invalid hyperlink.' },
          400
        )
      }

      const positionResult = await db.sql`
        SELECT
          COALESCE(MAX(display_order), 0) + 1
            AS next_position
        FROM carousel_items
      `

      const displayOrder =
        Number(positionResult[0].next_position)

      const result = await db.sql`
        INSERT INTO carousel_items (
          hyperlink,
          display_order
        )
        VALUES (
          ${hyperlink},
          ${displayOrder}
        )
        RETURNING *
      `

      return json(result[0], 201)
    }

    // ========================================
    // PATCH - UPDATE ITEM OR REORDER
    // ========================================

    if (req.method === 'PATCH') {
      const body = await req.json()

      // Bulk reorder:
      // { "order": [3, 1, 2] }

      if (Array.isArray(body.order)) {
        const order = body.order.map(Number)

        const existing = await db.sql`
          SELECT id
          FROM carousel_items
        `

        const existingIds =
          existing.map((item) => Number(item.id))

        const validOrder =
          order.length === existingIds.length &&
          order.every(validId) &&
          new Set(order).size === order.length &&
          order.every((id) =>
            existingIds.includes(id)
          )

        if (!validOrder) {
          return json(
            {
              error:
                'Invalid or duplicate carousel ordering.'
            },
            400
          )
        }

        if (order.length === 0) {
          return json({
            message: 'No carousel items to reorder.'
          })
        }

        await db.sql`
          UPDATE carousel_items AS ci
          SET display_order = positions.position
          FROM (
            SELECT
              value::integer AS id,
              ordinal::integer AS position
            FROM jsonb_array_elements_text(
              ${JSON.stringify(order)}::jsonb
            ) WITH ORDINALITY AS t(value, ordinal)
          ) AS positions
          WHERE ci.id = positions.id
        `

        return json({
          message:
            'Carousel order updated successfully.'
        })
      }

      // Update a single item's hyperlink or position.

      const id = Number(body.id)

      if (!validId(id)) {
        return json(
          { error: 'Valid carousel item ID is required.' },
          400
        )
      }

      const hasHyperlink =
        Object.prototype.hasOwnProperty.call(
          body,
          'hyperlink'
        )

      const hasDisplayOrder =
        Object.prototype.hasOwnProperty.call(
          body,
          'display_order'
        )

      if (!hasHyperlink && !hasDisplayOrder) {
        return json(
          { error: 'No fields provided to update.' },
          400
        )
      }

      if (
        hasHyperlink &&
        body.hyperlink !== null &&
        typeof body.hyperlink !== 'string'
      ) {
        return json(
          { error: 'Invalid hyperlink.' },
          400
        )
      }

      if (
        hasDisplayOrder &&
        (!Number.isSafeInteger(body.display_order) ||
          body.display_order < 1)
      ) {
        return json(
          { error: 'Invalid display order.' },
          400
        )
      }

      const hyperlink = hasHyperlink
        ? body.hyperlink?.trim() || null
        : null

      const result = await db.sql`
        UPDATE carousel_items
        SET
          hyperlink = CASE
            WHEN ${hasHyperlink}
            THEN ${hyperlink}
            ELSE hyperlink
          END,

          display_order = CASE
            WHEN ${hasDisplayOrder}
            THEN ${hasDisplayOrder
              ? body.display_order
              : null}
            ELSE display_order
          END

        WHERE id = ${id}
        RETURNING *
      `

      if (!result.length) {
        return json(
          { error: 'Carousel item not found.' },
          404
        )
      }

      return json(result[0])
    }

    // ========================================
    // DELETE - REMOVE CAROUSEL ITEM
    // ========================================

    if (req.method === 'DELETE') {
      const body = await req.json()
      const id = Number(body.id)

      if (!validId(id)) {
        return json(
          { error: 'Valid carousel item ID is required.' },
          400
        )
      }

      const images = await db.sql`
        SELECT image_key
        FROM carousel_images
        WHERE carousel_item_id = ${id}
      `

      const deleted = await db.sql`
        DELETE FROM carousel_items
        WHERE id = ${id}
        RETURNING id
      `

      if (!deleted.length) {
        return json(
          { error: 'Carousel item not found.' },
          404
        )
      }

      // The database cascade deletes carousel_images.
      // Blob storage must be cleaned up separately.

      const imageStore = getStore('carousel-images')

      for (const image of images) {
        try {
          await imageStore.delete(image.image_key)
        } catch (error) {
          console.error(
            'Failed to delete carousel blob:',
            image.image_key,
            error
          )
        }
      }

      return json({
        message: 'Carousel item deleted successfully.'
      })
    }
  } catch (error) {
    console.error('Carousel items error:', error)

    return json(
      { error: 'An unexpected error occurred.' },
      500
    )
  }
}
