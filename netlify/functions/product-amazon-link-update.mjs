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

    const amazonLink =
      typeof body.amazonLink === 'string'
        ? body.amazonLink.trim()
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
      SET amazon_link = ${amazonLink}
      WHERE id = ${productId}
      RETURNING
        id,
        amazon_link
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
        'Amazon link updated successfully.',
      product: updatedProduct
    })
  } catch (error) {
    console.error(
      'Unable to update Amazon link:',
      error
    )

    return Response.json(
      {
        error:
          error.message ||
          'Unable to update Amazon link.'
      },
      {
        status: 500
      }
    )
  }
}