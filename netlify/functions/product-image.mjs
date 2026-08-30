import { getStore } from '@netlify/blobs'

export default async (req) => {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')

  if (!key) {
    return Response.json(
      { error: 'Image key is required.' },
      { status: 400 }
    )
  }

  const imageStore = getStore('product-images')

  const image = await imageStore.get(key, {
    type: 'blob'
  })

  if (!image) {
    return Response.json(
      { error: 'Image not found.' },
      { status: 404 }
    )
  }

  return new Response(image, {
    headers: {
      'Content-Type': image.type || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}