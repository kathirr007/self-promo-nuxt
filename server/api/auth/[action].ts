import type { H3Event } from 'h3'
import { handleLogin, handleLogout, handleRegister, resetPassword } from '~~/server/controllers/user'

export default defineEventHandler(async (event: H3Event) => {
  const method = event.node.req.method
  const action = getRouterParam(event, 'action')

  if (action === 'login' && method === 'POST')
    return handleLogin(event)
  if (action === 'logout' && method === 'POST')
    return handleLogout(event)
  if (action === 'register' && method === 'POST')
    return handleRegister(event)
  // if (action === 'me' && method === 'GET')
  //   return getCurrentUser(event)
  if (action === 'resetpassword' && method === 'PUT')
    return resetPassword(event)

  throw createError({ statusCode: 404, message: 'Not Found api router' })
})
