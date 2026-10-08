
import { getDatabase } from '@netlify/database'
import { verifyRequestOrigin } from '@netlify/identity'

import { requireAuth } from './utils/requireAuth.mjs'

export default async (req) => {

  /* ========================================
     METHOD VALIDATION
  ======================================== */

  if (req.method !== 'PATCH') {
    return Response.json(
      {
        error: 'Method not allowed.'
      },
      {
        status: 405,
        headers: {
          Allow: 'PATCH'
        }
      }
    )
  }

  /* ========================================
     AUTHORIZATION (ADMIN ONLY)
  ======================================== */

  const { response } = await requireAuth()

  if (response) {
    return response
  }

  // Protect against cross-site requests.
  verifyRequestOrigin(req)

  /* ========================================
     UPDATE PRODUCT ITEM NUMBER
  ======================================== */

  try {
    const db = getDatabase()

    const body = await req.json()

    const productId = body.productId
    const itemNumber = body.itemNumber?.trim()

    if (!productId) {
      return Response.json(
        {
          error: 'Product ID is required.'
        },
        {
          status: 400
        }
      )
    }

    if (!itemNumber) {
      return Response.json(
        {
          error: 'Item number is required.'
        },
        {
          status: 400
        }
      )
    }

    const result = await db.sql`
      UPDATE products
      SET item_number = ${itemNumber}
      WHERE id = ${productId}
      RETURNING
        id,
        item_number
    `

    const updatedProduct = result[0]

    if (!updatedProduct) {
      return Response.json(
        {
          error: 'Product was not found.'
        },
        {
          status: 404
        }
      )
    }

    return Response.json({
      message: 'Item number updated successfully.',
      product: updatedProduct
    })

  } catch (error) {
    console.error(
      'Unable to update product item number:',
      error
    )

    return Response.json(
      {
        error:
          error.message ||
          'Unable to update item number.'
      },
      {
        status: 500
      }
    )
  }
}
