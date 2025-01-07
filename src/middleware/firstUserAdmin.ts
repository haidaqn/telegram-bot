import { getAdmin, setAdmin } from '~/utils/accessControl'

export function firstUserAdminMiddleware(ctx: any, next: any) {
  const currentAdmin = getAdmin()
  if (!currentAdmin && ctx.from && ctx.from.id) {
    const userId = ctx.from.id.toString()
    setAdmin(userId)
    ctx.reply('You are now the admin!')
  }
  return next()
}