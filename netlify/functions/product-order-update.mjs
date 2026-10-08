
import { getDatabase } from '@netlify/database'

const db = getDatabase()

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
     REQUEST VALIDATION
  ======================================== */

  let body

  try {
    body = await req.json()
  } catch {
    return Response.json(
      {
        error: 'Invalid JSON payload.'
      },
      {
        status: 400
      }
    )
  }

  const products = body?.products

  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return Response.json(
      {
        error: 'A product order is required.'
      },
      {
        status: 400
      }
    )
  }

  const productIds = new Set()

  for (const [index, product] of products.entries()) {
    if (
      !product ||
      !Number.isSafeInteger(product.id) ||
      product.id <= 0 ||
      !Number.isSafeInteger(product.display_order) ||
      product.display_order !== index + 1 ||
      productIds.has(product.id)
    ) {
      return Response.json(
        {
          error: 'Invalid or duplicate product ordering.'
        },
        {
          status: 400
        }
      )
    }

    productIds.add(product.id)
  }

  /* ========================================
     UPDATE PRODUCT ORDER
  ======================================== */

  let client

  try {
    client = await db.pool.connect()

    await client.query('BEGIN')

    // Prevent concurrent changes to the product
    // table while validating and saving the order.

    await client.query(`
      LOCK TABLE products
      IN SHARE ROW EXCLUSIVE MODE
    `)

    /* ========================================
       VERIFY ALL PRODUCTS ARE INCLUDED
    ======================================== */

    const existingProducts = await client.query(`
      SELECT id
      FROM products
    `)

    const existingIds = new Set(
      existingProducts.rows.map(
        (product) => String(product.id)
      )
    )

    const validProductSet =
      existingIds.size === productIds.size &&
      products.every(
        (product) => existingIds.has(String(product.id))
      )

    if (!validProductSet) {
      await client.query('ROLLBACK')

      return Response.json(
        {
          error:
            'The product list has changed. Refresh the page and try again.'
        },
        {
          status: 409
        }
      )
    }

    /* ========================================
       BULK UPDATE DISPLAY ORDER
    ======================================== */

    const result = await client.query(
      `
        UPDATE products AS p
        SET display_order = ordered.display_order
        FROM jsonb_to_recordset($1::jsonb)
          AS ordered(
            id bigint,
            display_order integer
          )
        WHERE p.id = ordered.id
      `,
      [
        JSON.stringify(products)
      ]
    )

    if (result.rowCount !== products.length) {
      throw new Error(
        'Not all product positions were updated.'
      )
    }

    /* ========================================
       COMMIT TRANSACTION
    ======================================== */

    await client.query('COMMIT')

    return Response.json(
      {
        message: 'Product order updated successfully.',
        updatedCount: result.rowCount
      },
      {
        status: 200
      }
    )

  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK')
      } catch (rollbackError) {
        console.error(
          'Unable to roll back product order:',
          rollbackError
        )
      }
    }

    console.error(
      'Unable to update product order:',
      error
    )

    return Response.json(
      {
        error: 'Unable to update product order.'
      },
      {
        status: 500
      }
    )

  } finally {
    client?.release()
  }
}
