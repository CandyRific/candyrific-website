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

    const description =
      typeof body.description === 'string'
        ? body.description.trim()
        : ''

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

    const result = await db.sql`
      UPDATE products
      SET description = ${description}
      WHERE id = ${productId}
      RETURNING
        id,
        description
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
      message:
        'Product description updated successfully.',
      product: updatedProduct
    })
  } catch (error) {
    console.error(
      'Unable to update product description:',
      error
    )

    return Response.json(
      {
        error:
          error.message ||
          'Unable to update product description.'
      },
      {
        status: 500
      }
    )
  }
}