import type { H3Event } from 'h3'
import type { SessionUser } from '~/types/auth'

/**
 * Middleware to ensure user is authenticated
 * Returns the user session if authenticated, throws 401 error otherwise
 */
export async function onlyAuthUser(event: H3Event): Promise<void> {
  const session = await requireUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  event.context.user = session.user as SessionUser
}

/**
 * Middleware to ensure user is an admin
 * Returns the user session if user is admin, throws 401/403 error otherwise
 */
export async function onlyAdmin(event: H3Event): Promise<void> {
  await onlyAuthUser(event)

  if (event.context.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required',
    })
  }

  // return user
}
