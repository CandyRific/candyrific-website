import { getStore } from '@netlify/blobs'

export default async (req) => {
  if (req.method !== 'GET') {
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


  const url = new URL(req.url)

  const key =
    url.searchParams.get('key')


  if (!key) {
    return Response.json(
      {
        error:
          'Image key is required.'
      },
      {
        status: 400
      }
    )
  }


  const imageStore =
    getStore('brand-images')


  const image =
    await imageStore.get(key, {
      type: 'blob'
    })


  if (!image) {
    return Response.json(
      {
        error:
          'Image not found.'
      },
      {
        status: 404
      }
    )
  }


  return new Response(
    image,
    {
      headers: {
        'Content-Type':
          image.type ||
          'application/octet-stream',

        'Cache-Control':
          'public, max-age=31536000, immutable'
      }
    }
  )
}