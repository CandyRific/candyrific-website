
import { getDatabase } from '@netlify/database'
import { verifyRequestOrigin } from '@netlify/identity'

import { requireAuth } from './utils/requireAuth.mjs'

export default async (req) => {
  try {

    /* ========================================
       GET ALL SEASONS (PUBLIC)
    ======================================== */

    if (req.method === 'GET') {
      const db = getDatabase()

      const seasons = await db.sql`
        SELECT
          id,
          name,
          created_at
        FROM seasons
        ORDER BY name ASC
      `

      return Response.json(seasons)
    }


    /* ========================================
       ADD SEASON (ADMIN ONLY)
    ======================================== */

    if (req.method === 'POST') {

      /* ========================================
         AUTHORIZATION
      ======================================== */

      const { response } = await requireAuth()

      if (response) {
        return response
      }

      // Protect against cross-site requests.
      verifyRequestOrigin(req)

      const db = getDatabase()

      const body = await req.json()

      const name =
        body?.name?.trim()

      if (!name) {
        return Response.json(
          {
            error: 'Season name is required.'
          },
          {
            status: 400
          }
        )
      }


      /* ========================================
         INSERT SEASON
      ======================================== */

      const result = await db.sql`
        INSERT INTO seasons (
          name
        )
        VALUES (
          ${name}
        )
        RETURNING
          id,
          name,
          created_at
      `

      return Response.json(
        result[0],
        {
          status: 201
        }
      )
    }


    /* ========================================
       METHOD NOT ALLOWED
    ======================================== */

    return Response.json(
      {
        error: 'Method not allowed.'
      },
      {
        status: 405,
        headers: {
          Allow: 'GET, POST'
        }
      }
    )

  } catch (error) {
    console.error(
      'Seasons function error:',
      error
    )

    return Response.json(
      {
        error:
          'Something went wrong while processing the season request.'
      },
      {
        status: 500
      }
    )
  }
}
