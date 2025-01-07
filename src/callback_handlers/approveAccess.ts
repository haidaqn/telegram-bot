import { Context, Telegraf } from 'telegraf';
import { isAdmin, addAllowedUser } from '~/utils/accessControl';

export default async (ctx: Context, bot: Telegraf<Context>): Promise<void> => {
  const callbackData: string | undefined = (ctx.callbackQuery as any)?.data;
  const fromId: string = ctx.from?.id.toString() || '';

  if (!callbackData) {
    console.error('No callback data found.');
    return;
  }

  // Only admin can approve
  if (!isAdmin(fromId)) {
    await ctx.answerCbQuery('You are not authorized to approve.', { show_alert: true });
    return;
  }

  if (callbackData.startsWith('approve_access_')) {
    const userIdToApprove: string = callbackData.replace('approve_access_', '');

    try {
      addAllowedUser(userIdToApprove);

      await ctx.answerCbQuery('User approved!', { show_alert: false });
      await ctx.editMessageText(`User ID ${userIdToApprove} has been granted access!`);
      await bot.telegram.sendMessage(userIdToApprove, 'Your access request has been approved!');
    } catch (error) {
      console.error('Error approving user:', error);
      await ctx.answerCbQuery('Failed to approve user. Please try again later.', { show_alert: true });
    }
  }
};
