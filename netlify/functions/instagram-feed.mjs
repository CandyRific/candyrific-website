export default async (req) => {
  if (req.method !== 'GET') {
    return Response.json(
      {
        error: 'Method not allowed'
      },
      {
        status: 405
      }
    )
  }

  const accessToken =
    process.env.INSTAGRAM_ACCESS_TOKEN

  const instagramUserId =
    process.env.INSTAGRAM_USER_ID

  const apiVersion =
    process.env.INSTAGRAM_API_VERSION ||
    'v25.0'

  if (!accessToken || !instagramUserId) {
    console.error(
      'Instagram environment variables are missing.'
    )

    return Response.json(
      {
        error:
          'Instagram feed is not configured.'
      },
      {
        status: 500
      }
    )
  }

  try {
    const fields = [
      'id',
      'caption',
      'media_type',
      'media_url',
      'thumbnail_url',
      'permalink',
      'timestamp',
      'username',
      'children{id,media_type,media_url,thumbnail_url}'
    ].join(',')

    const params = new URLSearchParams({
      fields,
      limit: '12',
      access_token: accessToken
    })

    const instagramUrl =
      `https://graph.instagram.com/` +
      `${apiVersion}/` +
      `${instagramUserId}/media?` +
      params.toString()

    const response = await fetch(
      instagramUrl
    )

    const data = await response.json()

    if (!response.ok) {
      console.error(
        'Instagram API error:',
        data
      )

      return Response.json(
        {
          error:
            'Unable to load Instagram feed.'
        },
        {
          status: response.status
        }
      )
    }

    const posts = (data.data || []).map(
      (post) => {
        const previewUrl =
          post.media_type === 'VIDEO'
            ? post.thumbnail_url
            : post.media_url

        return {
          id: post.id,
          caption: post.caption || '',
          mediaType: post.media_type,
          mediaUrl: post.media_url || '',
          thumbnailUrl:
            post.thumbnail_url || '',
          previewUrl:
            previewUrl || '',
          permalink:
            post.permalink || '',
          timestamp:
            post.timestamp || '',
          username:
            post.username || '',
          children:
            post.children?.data || []
        }
      }
    )

    return Response.json(
      {
        posts
      },
      {
        headers: {
          'Cache-Control':
            'public, max-age=300, s-maxage=900'
        }
      }
    )
  } catch (error) {
    console.error(
      'Instagram feed error:',
      error
    )

    return Response.json(
      {
        error:
          'Unable to load Instagram feed.'
      },
      {
        status: 500
      }
    )
  }
}