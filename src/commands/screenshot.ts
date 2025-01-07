import { Telegraf, Context, Markup } from 'telegraf';
import { getScreens, takeScreenshot, cleanupFile } from '~/utils/screenshot';
import screenshotDesktop from 'screenshot-desktop'

interface Screen {
  id: string;
}

export default (bot: Telegraf<Context>) => {
  // /screenshot command
  bot.command('screenshot', async (ctx: Context) => {
    try {
      const screens: Array<{ id: screenshotDesktop.DisplayID; name: string }> | any[] = await getScreens();

      if (screens.length === 1) {
        // Directly take a screenshot if there's only one screen
        try {
          const filePath: string = await takeScreenshot(screens[0].id);
          await ctx.replyWithPhoto({ source: filePath });
          cleanupFile(filePath);
        } catch (error:any) {
          await ctx.reply('Failed to take a screenshot.');
        }
      } else {
        // Show an inline keyboard with the list of screens, indexed from 1
        const buttons = screens.map((screen, index) =>
          Markup.button.callback(`Screen ${index + 1}`, `screenshot_${screen.id}`)
        );
        await ctx.reply('Select a screen to capture:', Markup.inlineKeyboard(buttons));
      }
    } catch (error:any) {
      await ctx.reply('Error retrieving screens.');
    }
  });

  // Handle callback queries related to screenshots
  bot.action('select_screen', async (ctx: Context) => {
    try {
      const screens: Array<{ id: screenshotDesktop.DisplayID; name: string }> | any[] = await getScreens();

      if (screens.length === 1) {
        try {
          const filePath: string = await takeScreenshot(screens[0].id);
          await ctx.replyWithPhoto({ source: filePath });
          cleanupFile(filePath);
        } catch (error:any) {
          await ctx.reply('Failed to take a screenshot.');
        }
      } else {
        const buttons = screens.map((screen, index) =>
          Markup.button.callback(`Screen ${index + 1}`, `screenshot_${screen.id}`)
        );
        await ctx.editMessageText('Select a screen to capture:', Markup.inlineKeyboard(buttons));
      }

      await ctx.answerCbQuery();
    } catch (error:any) {
      await ctx.reply('Error retrieving screens.');
    }
  });

  bot.action(/^screenshot_(.*)$/, async (ctx: Context) => {
    const screenId: string | undefined = (ctx as any).match?.[1];
    if (!screenId) {
      await ctx.reply('Invalid screen ID.');
      return;
    }

    try {
      const filePath: string = await takeScreenshot(screenId);
      await ctx.replyWithPhoto({ source: filePath });
      cleanupFile(filePath);
    } catch (error:any) {
      await ctx.reply('Failed to take a screenshot.');
    }
    await ctx.answerCbQuery();
  });
};
