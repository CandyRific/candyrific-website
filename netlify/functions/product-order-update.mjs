
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

  // Initialize database after authorization.
  const db = getDatabase()

  /* ========================================
     PARSE REQUEST BODY
  ======================================== */

  let body

  try {
    body = await req.json()
  } catch (error) {
    console.error(
      'Invalid product order JSON:',
      error
    )

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
    console.error(
      'Invalid product order payload.'
    )

    return Response.json(
      {
        error: 'A product order is required.'
      },
      {
        status: 400
      }
    )
  }

  /* ========================================
     VALIDATE PRODUCT ORDER
  ======================================== */

  const productIds = new Set()

  for (
    const [index, product]
    of products.entries()
  ) {

    const rawProductId =
      product?.id

    const productId =
      String(rawProductId ?? '')

    const isValidId =
      /^\d+$/.test(productId) &&
      BigInt(productId) > 0n &&
      BigInt(productId) <= 9223372036854775807n

    const isValidOrder =
      Number.isSafeInteger(
        product?.display_order
      ) &&
      product.display_order === index + 1

    const normalizedProductId =
      isValidId
        ? BigInt(productId).toString()
        : null

    const isDuplicate =
      normalizedProductId !== null &&
      productIds.has(normalizedProductId)

    if (
      !isValidId ||
      !isValidOrder ||
      isDuplicate
    ) {
      console.error(
        'Invalid product ordering:',
        {
          index,
          product,
          isValidId,
          isValidOrder,
          isDuplicate
        }
      )

      return Response.json(
        {
          error:
            'Invalid or duplicate product ordering.'
        },
        {
          status: 400
        }
      )
    }

    productIds.add(normalizedProductId)
  }

  /* ========================================
     DATABASE TRANSACTION
  ======================================== */

  let client
  let transactionStarted = false

  try {
    client = await db.pool.connect()

    await client.query('BEGIN')

    transactionStarted = true

    /* ========================================
       LOCK PRODUCTS TABLE
    ======================================== */

    await client.query(`
      LOCK TABLE products
      IN SHARE ROW EXCLUSIVE MODE
    `)

    /* ========================================
       VERIFY EXISTING PRODUCTS
    ======================================== */

    const existingProducts =
      await client.query(`
        SELECT id
        FROM products
      `)

    const existingIds = new Set(
      existingProducts.rows.map(
        (product) =>
          String(product.id)
      )
    )

    const validProductSet =
      existingIds.size === productIds.size &&
      [...productIds].every(
        (id) => existingIds.has(id)
      )

    if (!validProductSet) {
      console.error(
        'Product order mismatch:',
        {
          submittedCount: productIds.size,
          databaseCount: existingIds.size,
          missingFromRequest:
            [...existingIds].filter(
              (id) => !productIds.has(id)
            ),
          unknownProductIds:
            [...productIds].filter(
              (id) => !existingIds.has(id)
            )
        }
      )

      await client.query('ROLLBACK')
      transactionStarted = false

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
       PREPARE PRODUCT ORDER
    ======================================== */

    const updatedOrder =
      products.map(
        (product, index) => ({
          id: BigInt(
            String(product.id)
          ).toString(),
          display_order: index + 1
        })
      )

    /* ========================================
       UPDATE DISPLAY ORDER
    ======================================== */

    const result = await client.query(
      `
        UPDATE products AS p
        SET
          display_order = ordered.display_order
        FROM jsonb_to_recordset($1::jsonb)
          AS ordered(
            id bigint,
            display_order integer
          )
        WHERE p.id = ordered.id
      `,
      [
        JSON.stringify(updatedOrder)
      ]
    )

    /* ========================================
       VERIFY UPDATE COUNT
    ======================================== */

    if (
      result.rowCount !==
      updatedOrder.length
    ) {
      console.error(
        'Product order update count mismatch:',
        {
          expected: updatedOrder.length,
          updated: result.rowCount
        }
      )

      throw new Error(
        'Not all product positions were updated.'
      )
    }

    /* ========================================
       COMMIT TRANSACTION
    ======================================== */

    await client.query('COMMIT')
    transactionStarted = false

    console.log(
      'Product order updated successfully:',
      {
        updatedCount: result.rowCount
      }
    )

    return Response.json(
      {
        message:
          'Product order updated successfully.',
        updatedCount: result.rowCount
      },
      {
        status: 200
      }
    )

  } catch (error) {

    /* ========================================
       ROLLBACK ON ERROR
    ======================================== */

    if (
      client &&
      transactionStarted
    ) {
      try {
        await client.query('ROLLBACK')
      } catch (rollbackError) {
        console.error(
          'Product order rollback failed:',
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
        error:
          'Unable to update product order.'
      },
      {
        status: 500
      }
    )

  } finally {

    /* ========================================
       RELEASE DATABASE CONNECTION
    ======================================== */

    client?.release()
  }
}
