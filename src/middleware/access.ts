import { isAdmin, isAllowedUser } from '~/utils/accessControl'

export function accessMiddleware(ctx: any, next: any) {
  const fromId = ctx.from?.id
  const messageText = ctx.message?.text || ''
  const command = messageText.split(' ')[0]

  // Always allow admin
  if (fromId && isAdmin(fromId.toString())) {
    return next()
  }

  // Allow `/request_access` to non-allowed users
  if (command === '/request_access') {
    return next()
  }

  // If user is not allowed and not admin
  if (fromId && !isAllowedUser(fromId.toString())) {
    return ctx.reply('Access denied. Please use /request_access to request permission.')
  }

  return next()
}