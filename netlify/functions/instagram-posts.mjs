
import { getDatabase } from '@netlify/database'
import { verifyRequestOrigin } from '@netlify/identity'

import { requireAuth } from './utils/requireAuth.mjs'

/* ========================================
   HELPERS
======================================== */

const isValidId = (id) => {
  return (
    Number.isInteger(id) &&
    id >= 1 &&
    id <= 4
  )
}

const isValidInstagramLink = (link) => {
  if (typeof link !== 'string') {
    return false
  }

  try {
    const url = new URL(link)

    return (
      url.protocol === 'https:' &&
      [
        'instagram.com',
        'www.instagram.com'
      ].includes(url.hostname) &&
      /^\/(p|reel|tv)\/[^/]+\/?$/.test(
        url.pathname
      )
    )
  } catch {
    return false
  }
}

/* ========================================
   FUNCTION
======================================== */

export default async (req) => {
  const allowedMethods = [
    'GET',
    'POST',
    'PATCH',
    'DELETE'
  ]

  if (!allowedMethods.includes(req.method)) {
    return Response.json(
      {
        error: 'Method not allowed.'
      },
      {
        status: 405,
        headers: {
          Allow: allowedMethods.join(', ')
        }
      }
    )
  }

  /* ========================================
     AUTHENTICATION
  ======================================== */

  if (
    ['POST', 'PATCH', 'DELETE'].includes(
      req.method
    )
  ) {
    const { response } = await requireAuth()

    if (response) {
      return response
    }

    verifyRequestOrigin(req)
  }

  try {
    const db = getDatabase()

    /* ========================================
       GET INSTAGRAM POSTS
    ======================================== */

    if (req.method === 'GET') {
      const posts = await db.sql`
        SELECT
          id,
          instagram_link
        FROM instagram_posts
        WHERE id BETWEEN 1 AND 4
        ORDER BY id ASC
      `

      return Response.json(posts)
    }

    /* ========================================
       PARSE REQUEST BODY
    ======================================== */

    let body

    try {
      body = await req.json()
    } catch {
      return Response.json(
        {
          error: 'Invalid JSON request body.'
        },
        {
          status: 400
        }
      )
    }

    const id = body?.id

    if (!isValidId(id)) {
      return Response.json(
        {
          error:
            'A valid Instagram slot ID (1-4) is required.'
        },
        {
          status: 400
        }
      )
    }

    /* ========================================
       POST - ADD INSTAGRAM LINK
    ======================================== */

    if (req.method === 'POST') {
      const instagramLink =
        body.instagram_link?.trim()

      if (!isValidInstagramLink(instagramLink)) {
        return Response.json(
          {
            error: 'Invalid Instagram URL.'
          },
          {
            status: 400
          }
        )
      }

      const existing = await db.sql`
        SELECT id
        FROM instagram_posts
        WHERE id = ${id}
           OR instagram_link = ${instagramLink}
      `

      if (existing.length > 0) {
        return Response.json(
          {
            error:
              'Instagram slot or URL already exists.'
          },
          {
            status: 409
          }
        )
      }

      const result = await db.sql`
        INSERT INTO instagram_posts (
          id,
          instagram_link
        )
        VALUES (
          ${id},
          ${instagramLink}
        )
        RETURNING
          id,
          instagram_link
      `

      return Response.json(
        result[0],
        {
          status: 201
        }
      )
    }

    /* ========================================
       PATCH - UPDATE INSTAGRAM LINK
    ======================================== */

    if (req.method === 'PATCH') {
      const instagramLink =
        body.instagram_link?.trim()

      if (!isValidInstagramLink(instagramLink)) {
        return Response.json(
          {
            error: 'Invalid Instagram URL.'
          },
          {
            status: 400
          }
        )
      }

      const duplicate = await db.sql`
        SELECT id
        FROM instagram_posts
        WHERE instagram_link = ${instagramLink}
          AND id != ${id}
      `

      if (duplicate.length > 0) {
        return Response.json(
          {
            error:
              'This Instagram URL is already assigned to another slot.'
          },
          {
            status: 409
          }
        )
      }

      const result = await db.sql`
        UPDATE instagram_posts
        SET instagram_link = ${instagramLink}
        WHERE id = ${id}
        RETURNING
          id,
          instagram_link
      `

      if (result.length === 0) {
        return Response.json(
          {
            error: 'Instagram post not found.'
          },
          {
            status: 404
          }
        )
      }

      return Response.json(result[0])
    }

    /* ========================================
       DELETE - REMOVE INSTAGRAM LINK
    ======================================== */

    if (req.method === 'DELETE') {
      const result = await db.sql`
        DELETE FROM instagram_posts
        WHERE id = ${id}
        RETURNING id
      `

      if (result.length === 0) {
        return Response.json(
          {
            error: 'Instagram post not found.'
          },
          {
            status: 404
          }
        )
      }

      return Response.json({
        message:
          'Instagram post deleted successfully.',
        id
      })
    }

  } catch (error) {
    console.error(
      'Instagram posts function error:',
      error
    )

    const code =
      error?.code ||
      error?.cause?.code

    if (code === '23505') {
      return Response.json(
        {
          error:
            'Instagram slot or URL already exists.'
        },
        {
          status: 409
        }
      )
    }

    return Response.json(
      {
        error:
          'An unexpected error occurred.'
      },
      {
        status: 500
      }
    )
  }
}
