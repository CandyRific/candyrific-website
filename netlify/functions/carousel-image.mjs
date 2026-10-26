
import { getStore } from '@netlify/blobs'

export default async (req) => {
  if (req.method !== 'GET') {
    return Response.json(
      { error: 'Method not allowed.' },
      { status: 405 }
    )
  }

  try {
    const url = new URL(req.url)

    const key = url.searchParams.get('key')

    if (!key) {
      return Response.json(
        { error: 'Image key is required.' },
        { status: 400 }
      )
    }

    // ========================================
    // GET IMAGE FROM BLOB STORAGE
    // ========================================

    const imageStore = getStore('carousel-images')

    const image = await imageStore.get(key, {
      type: 'blob'
    })

    if (!image) {
      return Response.json(
        { error: 'Image not found.' },
        { status: 404 }
      )
    }

    // Determine content type from the generated key.

    const extension =
      key.split('.').pop()?.toLowerCase()

    const contentTypes = {
      webp: 'image/webp',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png'
    }

    const contentType =
      contentTypes[extension] ||
      'application/octet-stream'

    // ========================================
    // RETURN IMAGE
    // ========================================

    return new Response(image, {
      headers: {
        'Content-Type': contentType,

        'Cache-Control':
          'public, max-age=31536000, immutable',

        'X-Content-Type-Options': 'nosniff'
      }
    })
  } catch (error) {
    console.error(
      'Carousel image retrieval error:',
      error
    )

    return Response.json(
      { error: 'Unable to retrieve carousel image.' },
      { status: 500 }
    )
  }
}
