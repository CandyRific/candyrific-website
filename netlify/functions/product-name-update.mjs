import { getDatabase } from '@netlify/database'

export default async (req) => {
  const db = getDatabase()

  if (req.method !== 'PATCH') {
    return Response.json(
      {
        error: 'Method not allowed.'
      },
      {
        status: 405
      }
    )
  }

  try {
    const body = await req.json()

    const productId = body.productId
    const name = body.name?.trim()

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

    if (!name) {
      return Response.json(
        {
          error: 'Product name is required.'
        },
        {
          status: 400
        }
      )
    }

    const result = await db.sql`
      UPDATE products
      SET name = ${name}
      WHERE id = ${productId}
      RETURNING
        id,
        name
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
      message: 'Product name updated successfully.',
      product: updatedProduct
    })
  } catch (error) {
    console.error(
      'Unable to update product name:',
      error
    )

    return Response.json(
      {
        error:
          error.message ||
          'Unable to update product name.'
      },
      {
        status: 500
      }
    )
  }
}