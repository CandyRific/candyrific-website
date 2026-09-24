import { getDatabase } from '@netlify/database'

/* ========================================
   GET CURRENT PRODUCT BRANDS
======================================== */

const getProductBrands = async (
  db,
  productId
) => {
  return await db.sql`
    SELECT
      b.id,
      b.name,
      b.image_key
    FROM brands b
    INNER JOIN product_brands pb
      ON pb.brand_id = b.id
    WHERE pb.product_id = ${productId}
    ORDER BY b.name ASC
  `
}

/* ========================================
   FUNCTION
======================================== */

export default async (req) => {
  const db = getDatabase()

  /* ========================================
     GET
     
     Retrieve brands currently associated
     with a product.
  ======================================== */

  if (req.method === 'GET') {
    try {
      const url = new URL(req.url)

      const productId =
        url.searchParams.get('productId')

      if (!productId) {
        return Response.json(
          {
            error:
              'Product ID is required.'
          },
          {
            status: 400
          }
        )
      }

      const brands =
        await getProductBrands(
          db,
          productId
        )

      return Response.json(brands)
    } catch (error) {
      console.error(
        'Unable to load product brands:',
        error
      )

      return Response.json(
        {
          error:
            error.message ||
            'Unable to load product brands.'
        },
        {
          status: 500
        }
      )
    }
  }

  /* ========================================
     POST
     
     Add existing brands to the product.
  ======================================== */

  if (req.method === 'POST') {
    try {
      const body = await req.json()

      const productId =
        body.productId

      const brandIds =
        Array.isArray(body.brandIds)
          ? body.brandIds
          : []

      if (!productId) {
        return Response.json(
          {
            error:
              'Product ID is required.'
          },
          {
            status: 400
          }
        )
      }

      if (brandIds.length === 0) {
        const brands =
          await getProductBrands(
            db,
            productId
          )

        return Response.json({
          message:
            'No brands needed to be added.',
          brands
        })
      }

      for (const brandId of brandIds) {
        /*
         * Make sure the brand actually
         * exists before associating it.
         */
        const existingBrands =
          await db.sql`
            SELECT id
            FROM brands
            WHERE id = ${brandId}
            LIMIT 1
          `

        if (existingBrands.length === 0) {
          return Response.json(
            {
              error:
                `Brand ${brandId} was not found.`
            },
            {
              status: 404
            }
          )
        }

        /*
         * Check whether the relationship
         * already exists.
         */
        const existingRelationships =
          await db.sql`
            SELECT
              product_id,
              brand_id
            FROM product_brands
            WHERE product_id = ${productId}
              AND brand_id = ${brandId}
            LIMIT 1
          `

        /*
         * Only insert if it isn't already
         * associated.
         */
        if (
          existingRelationships.length === 0
        ) {
          await db.sql`
            INSERT INTO product_brands (
              product_id,
              brand_id
            )
            VALUES (
              ${productId},
              ${brandId}
            )
          `
        }
      }

      const brands =
        await getProductBrands(
          db,
          productId
        )

      return Response.json({
        message:
          'Brands added successfully.',
        brands
      })
    } catch (error) {
      console.error(
        'Unable to add product brands:',
        error
      )

      return Response.json(
        {
          error:
            error.message ||
            'Unable to add product brands.'
        },
        {
          status: 500
        }
      )
    }
  }

  /* ========================================
     DELETE
     
     Remove brands from the product.
  ======================================== */

  if (req.method === 'DELETE') {
    try {
      const body = await req.json()

      const productId =
        body.productId

      const brandIds =
        Array.isArray(body.brandIds)
          ? body.brandIds
          : []

      if (!productId) {
        return Response.json(
          {
            error:
              'Product ID is required.'
          },
          {
            status: 400
          }
        )
      }

      if (brandIds.length === 0) {
        const brands =
          await getProductBrands(
            db,
            productId
          )

        return Response.json({
          message:
            'No brands needed to be removed.',
          brands
        })
      }

      for (const brandId of brandIds) {
        await db.sql`
          DELETE FROM product_brands
          WHERE product_id = ${productId}
            AND brand_id = ${brandId}
        `
      }

      const brands =
        await getProductBrands(
          db,
          productId
        )

      return Response.json({
        message:
          'Brands removed successfully.',
        brands
      })
    } catch (error) {
      console.error(
        'Unable to remove product brands:',
        error
      )

      return Response.json(
        {
          error:
            error.message ||
            'Unable to remove product brands.'
        },
        {
          status: 500
        }
      )
    }
  }

  /* ========================================
     METHOD NOT ALLOWED
  ======================================== */

  return Response.json(
    {
      error:
        'Method not allowed.'
    },
    {
      status: 405
    }
  )
}