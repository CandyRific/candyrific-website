
import { getDatabase } from '@netlify/database'
import { verifyRequestOrigin } from '@netlify/identity'

import { requireAuth } from './utils/requireAuth.mjs'

/* ========================================
   GET CURRENT PRODUCT SEASONS
======================================== */

const getProductSeasons = async (
  db,
  productId
) => {
  return await db.sql`
    SELECT
      s.id,
      s.name
    FROM seasons s
    INNER JOIN product_seasons ps
      ON ps.season_id = s.id
    WHERE ps.product_id = ${productId}
    ORDER BY s.name ASC
  `
}

/* ========================================
   FUNCTION
======================================== */

export default async (req) => {

  /* ========================================
     GET (PUBLIC)
  ======================================== */

  if (req.method === 'GET') {
    try {
      const db = getDatabase()

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

      const seasons =
        await getProductSeasons(
          db,
          productId
        )

      return Response.json(seasons)
    } catch (error) {
      console.error(
        'Unable to load product seasons:',
        error
      )

      return Response.json(
        {
          error:
            error.message ||
            'Unable to load product seasons.'
        },
        {
          status: 500
        }
      )
    }
  }

  /* ========================================
     POST (ADMIN ONLY)

     Add existing seasons to product.
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

    try {
      const db = getDatabase()

      const body = await req.json()

      const productId =
        body.productId

      const seasonIds =
        Array.isArray(body.seasonIds)
          ? body.seasonIds
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

      if (seasonIds.length === 0) {
        const seasons =
          await getProductSeasons(
            db,
            productId
          )

        return Response.json({
          message:
            'No seasons needed to be added.',
          seasons
        })
      }

      for (const seasonId of seasonIds) {

        /* Make sure season exists */

        const existingSeasons =
          await db.sql`
            SELECT id
            FROM seasons
            WHERE id = ${seasonId}
            LIMIT 1
          `

        if (existingSeasons.length === 0) {
          return Response.json(
            {
              error:
                `Season ${seasonId} was not found.`
            },
            {
              status: 404
            }
          )
        }

        /* Check relationship */

        const existingRelationships =
          await db.sql`
            SELECT
              product_id,
              season_id
            FROM product_seasons
            WHERE product_id = ${productId}
              AND season_id = ${seasonId}
            LIMIT 1
          `

        /* Insert only if not already linked */

        if (
          existingRelationships.length === 0
        ) {
          await db.sql`
            INSERT INTO product_seasons (
              product_id,
              season_id
            )
            VALUES (
              ${productId},
              ${seasonId}
            )
          `
        }
      }

      const seasons =
        await getProductSeasons(
          db,
          productId
        )

      return Response.json({
        message:
          'Seasons added successfully.',
        seasons
      })
    } catch (error) {
      console.error(
        'Unable to add product seasons:',
        error
      )

      return Response.json(
        {
          error:
            error.message ||
            'Unable to add product seasons.'
        },
        {
          status: 500
        }
      )
    }
  }

  /* ========================================
     DELETE (ADMIN ONLY)

     Remove seasons from product.
  ======================================== */

  if (req.method === 'DELETE') {

    /* ========================================
       AUTHORIZATION
    ======================================== */

    const { response } = await requireAuth()

    if (response) {
      return response
    }

    verifyRequestOrigin(req)

    try {
      const db = getDatabase()

      const body = await req.json()

      const productId =
        body.productId

      const seasonIds =
        Array.isArray(body.seasonIds)
          ? body.seasonIds
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

      if (seasonIds.length === 0) {
        const seasons =
          await getProductSeasons(
            db,
            productId
          )

        return Response.json({
          message:
            'No seasons needed to be removed.',
          seasons
        })
      }

      for (const seasonId of seasonIds) {
        await db.sql`
          DELETE FROM product_seasons
          WHERE product_id = ${productId}
            AND season_id = ${seasonId}
        `
      }

      const seasons =
        await getProductSeasons(
          db,
          productId
        )

      return Response.json({
        message:
          'Seasons removed successfully.',
        seasons
      })
    } catch (error) {
      console.error(
        'Unable to remove product seasons:',
        error
      )

      return Response.json(
        {
          error:
            error.message ||
            'Unable to remove product seasons.'
        },
        {
          status: 500
        }
      )
    }
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
        Allow: 'GET, POST, DELETE'
      }
    }
  )
}
