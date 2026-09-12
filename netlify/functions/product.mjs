import { getDatabase } from '@netlify/database'

export default async (req) => {
  const db = getDatabase()

  if (req.method === 'GET') {
    const url = new URL(req.url)
    const itemNumber = url.searchParams.get('itemNumber')

    if (!itemNumber) {
      return Response.json(
        { error: 'Item number is required.' },
        { status: 400 }
      )
    }

    const products = await db.sql`
      SELECT
        p.id,
        p.item_number,
        p.name,
        p.description,
        p.amazon_link,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'image_key', pi.image_key,
              'display_order', pi.display_order
            )
            ORDER BY pi.display_order, pi.id
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'::json
        ) AS images
      FROM products p
      LEFT JOIN product_images pi
        ON pi.product_id = p.id
      WHERE p.item_number = ${itemNumber}
      GROUP BY
        p.id,
        p.item_number,
        p.name,
        p.description,
        p.amazon_link
    `

    if (products.length === 0) {
      return Response.json(
        { error: 'Product not found.' },
        { status: 404 }
      )
    }

    return Response.json(products[0])
  }

  return Response.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  )
}