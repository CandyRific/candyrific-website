import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'

export default async (req) => {
  const db = getDatabase()

  if (req.method === 'GET') {
  const url = new URL(req.url)

  const brandIds = url.searchParams
    .getAll('brand')
    .filter((id) => /^\d+$/.test(id))

  const brandIdList = brandIds.join(',')

  const products = await db.sql`
    SELECT
      p.id,
      p.item_number,
      p.name,
      p.description,
      p.amazon_link,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', pi.id,
              'image_key', pi.image_key,
              'display_order', pi.display_order
            )
            ORDER BY pi.display_order, pi.id
          )
          FROM product_images pi
          WHERE pi.product_id = p.id
        ),
        '[]'::json
      ) AS images,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', b.id,
              'name', b.name
            )
            ORDER BY b.name
          )
          FROM product_brands pb
          JOIN brands b
            ON b.id = pb.brand_id
          WHERE pb.product_id = p.id
        ),
        '[]'::json
      ) AS brands

    FROM products p

    WHERE (
      ${brandIdList} = ''
      OR EXISTS (
        SELECT 1
        FROM product_brands pb_filter
        WHERE pb_filter.product_id = p.id
        AND pb_filter.brand_id = ANY(
          string_to_array(
            ${brandIdList},
            ','
          )::bigint[]
        )
      )
    )

    ORDER BY p.created_at DESC
  `

  return Response.json(products)
}

  if (req.method === 'POST') {
  const formData =
    await req.formData()


  const productNumber =
    formData.get('productNumber')

  const name =
    formData.get('name')

  const description =
    formData.get('description')


  const amazonLinkValue =
    formData.get('amazonLink')

  const amazonLink =
    amazonLinkValue?.trim() || null


  const images =
    formData.getAll('image')


  const brandIds =
    formData
      .getAll('brandIds')
      .map((id) => Number(id))
      .filter((id) =>
        Number.isInteger(id)
      )


  if (!name) {
    return Response.json(
      {
        error:
          'Product name is required.'
      },
      {
        status: 400
      }
    )
  }


  const imageKeys = []


  if (
    images &&
    images.length > 0
  ) {
    const imageStore =
      getStore('product-images')


    for (const img of images) {

      if (
        !img ||
        img.size === 0
      ) {
        continue
      }


      const extension =
        img.name
          .split('.')
          .pop()


      const key =
        `${crypto.randomUUID()}.${extension}`


      await imageStore.set(
        key,
        img
      )


      imageKeys.push(key)
    }
  }


  const products =
    await db.sql`
      INSERT INTO products (
        name,
        description,
        item_number,
        amazon_link
      )
      VALUES (
        ${name},
        ${description},
        ${productNumber},
        ${amazonLink}
      )
      RETURNING *
    `


  const product =
    products[0]


  if (imageKeys.length > 0) {

    for (
      let index = 0;
      index < imageKeys.length;
      index++
    ) {

      const key =
        imageKeys[index]


      await db.sql`
        INSERT INTO product_images (
          product_id,
          image_key,
          display_order
        )
        VALUES (
          ${product.id},
          ${key},
          ${index + 1}
        )
      `
    }
  }


  if (brandIds.length > 0) {

    for (const brandId of brandIds) {

      await db.sql`
        INSERT INTO product_brands (
          product_id,
          brand_id
        )
        VALUES (
          ${product.id},
          ${brandId}
        )
      `
    }
  }


  return Response.json(
    product,
    {
      status: 201
    }
  )
}
}