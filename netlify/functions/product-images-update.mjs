
import { getDatabase } from '@netlify/database'
import { getStore } from '@netlify/blobs'
import { verifyRequestOrigin } from '@netlify/identity'

import { requireAuth } from './utils/requireAuth.mjs'

/* ========================================
   GET PRODUCT IMAGES
======================================== */

const getProductImages = async (db, productId) => {
  return await db.sql`
    SELECT id, product_id, image_key, display_order
    FROM product_images
    WHERE product_id = ${productId}
    ORDER BY display_order ASC, id ASC
  `
}

const validProductId = (value) =>
  Number.isSafeInteger(Number(value)) && Number(value) > 0 &&
  value !== null && value !== undefined && String(value).trim() !== ''

/* ========================================
   FUNCTION
======================================== */

export default async (req) => {
  /* ========================================
     GET (PUBLIC)
  ======================================== */
  if (req.method === 'GET') {
    try {
      const db = getDatabase()
      const productId = new URL(req.url).searchParams.get('productId')

      if (!validProductId(productId)) {
        return Response.json({ error: 'A valid product ID is required.' }, { status: 400 })
      }

      return Response.json(await getProductImages(db, Number(productId)))
    } catch (error) {
      console.error('Unable to load product images:', error)
      return Response.json(
        { error: error.message || 'Unable to load product images.' },
        { status: 500 }
      )
    }
  }

  /* ========================================
     AUTHORIZATION FOR WRITE METHODS
  ======================================== */
  if (!['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    return Response.json(
      { error: 'Method not allowed.' },
      { status: 405, headers: { Allow: 'GET, POST, PATCH, DELETE' } }
    )
  }

  const { response } = await requireAuth()
  if (response) return response
  verifyRequestOrigin(req)

  /* ========================================
     PATCH (ADMIN ONLY)

     imageIds must contain ALL remaining images
     for this product, in desired UI order.
     Values are normalized to 1..N.
  ======================================== */
  if (req.method === 'PATCH') {
    try {
      const db = getDatabase()
      const body = await req.json()
      const { productId, imageIds } = body || {}

      if (!validProductId(productId)) {
        return Response.json({ error: 'A valid product ID is required.' }, { status: 400 })
      }

      if (!Array.isArray(imageIds) ||
          imageIds.some((id) => !Number.isSafeInteger(Number(id)) || Number(id) <= 0) ||
          new Set(imageIds.map(Number)).size !== imageIds.length) {
        return Response.json({ error: 'Invalid or duplicate image IDs.' }, { status: 400 })
      }

      const current = await getProductImages(db, Number(productId))
      const currentIds = new Set(current.map((image) => Number(image.id)))
      const requestedIds = imageIds.map(Number)

      // Exact-set comparison prevents dropping IDs or editing another product.
      if (requestedIds.length !== currentIds.size ||
          requestedIds.some((id) => !currentIds.has(id))) {
        return Response.json(
          { error: 'Image list does not match this product. Reload and try again.' },
          { status: 409 }
        )
      }

      for (let index = 0; index < requestedIds.length; index += 1) {
        const imageId = requestedIds[index]
        const position = index + 1

        await db.sql`
          UPDATE product_images
          SET display_order = ${position}
          WHERE id = ${imageId} AND product_id = ${Number(productId)}
        `
      }

      const images = await getProductImages(db, Number(productId))
      return Response.json({ message: 'Image order updated successfully.', images })
    } catch (error) {
      console.error('Unable to update image order:', error)
      return Response.json(
        { error: error.message || 'Unable to update image order.' },
        { status: 500 }
      )
    }
  }

  /* ========================================
     POST (ADMIN ONLY)
     Add new images.
  ======================================== */
  if (req.method === 'POST') {
    const uploadedBlobKeys = []

    try {
      const db = getDatabase()
      const formData = await req.formData()
      const productId = formData.get('productId')
      const images = formData.getAll('images')

      if (!validProductId(productId)) {
        return Response.json({ error: 'A valid product ID is required.' }, { status: 400 })
      }

      const validImages = images.filter((image) => image && image.size > 0)
      if (validImages.length === 0) {
        return Response.json({
          message: 'No new images to add.',
          images: await getProductImages(db, Number(productId))
        })
      }

      const orderResult = await db.sql`
        SELECT COALESCE(MAX(display_order), 0) AS max_order
        FROM product_images
        WHERE product_id = ${Number(productId)}
      `
      let displayOrder = Number(orderResult[0]?.max_order ?? 0)
      const imageStore = getStore('product-images')

      for (const image of validImages) {
        const extension = image.name?.split('.').pop()?.toLowerCase() || 'webp'
        const imageKey = `${crypto.randomUUID()}.${extension}`

        await imageStore.set(imageKey, image)
        uploadedBlobKeys.push(imageKey)
        displayOrder += 1

        await db.sql`
          INSERT INTO product_images (product_id, image_key, display_order)
          VALUES (${Number(productId)}, ${imageKey}, ${displayOrder})
        `
      }

      return Response.json({
        message: 'Images added successfully.',
        images: await getProductImages(db, Number(productId))
      }, { status: 201 })
    } catch (error) {
      console.error('Unable to add product images:', error)
      // Preserve the original endpoint's cleanup behavior.
      const imageStore = getStore('product-images')
      for (const imageKey of uploadedBlobKeys) {
        try {
          await imageStore.delete(imageKey)
        } catch (cleanupError) {
          console.error('Unable to clean up image blob:', cleanupError)
        }
      }
      return Response.json({ error: error.message || 'Unable to add product images.' }, { status: 500 })
    }
  }

  /* ========================================
     DELETE (ADMIN ONLY)
     Remove existing images.
  ======================================== */
  if (req.method === 'DELETE') {
    try {
      const db = getDatabase()
      const body = await req.json()
      const productId = body?.productId
      const imageIds = Array.isArray(body?.imageIds) ? body.imageIds : []

      if (!validProductId(productId)) {
        return Response.json({ error: 'A valid product ID is required.' }, { status: 400 })
      }

      if (imageIds.length === 0) {
        return Response.json({
          message: 'No images needed to be removed.',
          images: await getProductImages(db, Number(productId))
        })
      }

      const imageStore = getStore('product-images')
      for (const imageId of imageIds) {
        const imageRows = await db.sql`
          SELECT id, image_key
          FROM product_images
          WHERE id = ${imageId} AND product_id = ${Number(productId)}
          LIMIT 1
        `
        if (imageRows.length === 0) continue
        const image = imageRows[0]

        await db.sql`
          DELETE FROM product_images
          WHERE id = ${imageId} AND product_id = ${Number(productId)}
        `

        if (image.image_key) {
          try {
            await imageStore.delete(image.image_key)
          } catch (blobError) {
            console.error('Database image removed, but blob cleanup failed:', blobError)
          }
        }
      }

      return Response.json({
        message: 'Images removed successfully.',
        images: await getProductImages(db, Number(productId))
      })
    } catch (error) {
      console.error('Unable to remove product images:', error)
      return Response.json({ error: error.message || 'Unable to remove product images.' }, { status: 500 })
    }
  }
}
