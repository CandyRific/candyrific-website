import { getStore } from '@netlify/blobs'

export default async (req) => {
  try {
    if (req.method !== 'GET') {
      return Response.json(
        {
          error: 'Method not allowed.',
        },
        {
          status: 405,
        }
      )
    }

    const url = new URL(req.url)
    const imageKey = url.searchParams.get('key')

    if (!imageKey) {
      return Response.json(
        {
          error: 'Image key is required.',
        },
        {
          status: 400,
        }
      )
    }

    const seasonImageStore = getStore('season-images')

    const image = await seasonImageStore.get(imageKey, {
      type: 'arrayBuffer',
    })

    if (!image) {
      return Response.json(
        {
          error: 'Season image not found.',
        },
        {
          status: 404,
        }
      )
    }

    const metadata = await seasonImageStore.getMetadata(imageKey)

    const contentType =
      metadata?.metadata?.contentType || 'application/octet-stream'

    return new Response(image, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Season image function error:', error)

    return Response.json(
      {
        error: 'Unable to retrieve season image.',
      },
      {
        status: 500,
      }
    )
  }
}