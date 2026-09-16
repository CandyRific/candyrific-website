import { getStore } from '@netlify/blobs'
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
          image_key,
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
      const formData = await req.formData()

      const name = formData.get('name')
      const image = formData.get('image')


      /* ========================================
         VALIDATION
      ======================================== */

      if (!name || !name.trim()) {
        return Response.json(
          {
            error: 'Season name is required.',
          },
          {
            status: 400,
          }
        )
      }

      if (!image || typeof image === 'string') {
        return Response.json(
          {
            error: 'Season image is required.',
          },
          {
            status: 400,
          }
        )
      }


      /* ========================================
         IMAGE KEY
      ======================================== */

      const safeSeasonName = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const safeFileName = image.name
        .toLowerCase()
        .replace(/[^a-z0-9.-]+/g, '-')

      const imageKey =
        `seasons/${Date.now()}-${safeSeasonName}-${safeFileName}`


      /* ========================================
         UPLOAD IMAGE
      ======================================== */

      const seasonImageStore = getStore('season-images')

      const imageBuffer = await image.arrayBuffer()

      await seasonImageStore.set(imageKey, imageBuffer, {
        metadata: {
          contentType: image.type,
          seasonName: name.trim(),
        },
      })


      /* ========================================
         INSERT SEASON
      ======================================== */

      const result = await db.sql`
        INSERT INTO seasons (
          name,
          image_key
        )
        VALUES (
          ${name.trim()},
          ${imageKey}
        )
        RETURNING
          id,
          name,
          image_key,
          created_at
      `

      return Response.json(
        result[0],
        {
          status: 201,
        }
      )
    }


    /* ========================================
       METHOD NOT ALLOWED
    ======================================== */

    return Response.json(
      {
        error: 'Method not allowed.',
      },
      {
        status: 405,
      }
    )
  } catch (error) {
    console.error('Seasons function error:', error)

    return Response.json(
      {
        error: 'Something went wrong while processing the season request.',
      },
      {
        status: 500,
      }
    )
  }
}