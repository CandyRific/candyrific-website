import { getUser } from '@netlify/identity'

export const requireAuth = async () => {
  const user = await getUser()

  if (!user) {
    return {
      user: null,
      response: Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  if (!user.roles?.includes('admin')) {
    return {
      user: null,
      response: Response.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
  }

  return {
    user,
    response: null
  }
}