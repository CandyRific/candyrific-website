import { getDatabase } from '@netlify/neon'

export default async (req) => {
  try {
    const db = getDatabase()

    /* ========================================
       GET ALL SEASONS
    ======================================== */

    if (req.method === 'GET') {
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
       ADD SEASON
    ======================================== */

    if (req.method === 'POST') {
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
        status: 405
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