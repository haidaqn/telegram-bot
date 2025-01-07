// @ts-ignore
import dotenv from 'dotenv';
import { Telegraf, Context } from 'telegraf';
import { initUsers } from './utils/accessControl';
import approveAccessHandler from './callback_handlers/approveAccess';
import { firstUserAdminMiddleware } from '~/middleware/firstUserAdmin'
import { accessMiddleware } from '~/middleware/access'
import { registerCommands } from '~/commands'

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
if (!BOT_TOKEN) {
  console.error('Error: TELEGRAM_TOKEN is not defined in .env file');
  process.exit(1);
}

const bot = new Telegraf<Context>(BOT_TOKEN);

// Initialize users
initUsers();

// Middleware
bot.use(firstUserAdminMiddleware);
bot.use(accessMiddleware);

// Register bot commands
registerCommands(bot);

// Callback query handling
bot.on('callback_query', async (ctx) => {
  await approveAccessHandler(ctx, bot);
});

// Error handling
bot.catch((err, ctx) => {
  console.error(`Bot Error: ${err}`, ctx.updateType);
});

// Launch bot and set commands
bot.launch().then(async () => {
  await bot.telegram.setMyCommands([
    { command: 'screenshot', description: 'Take a screenshot of a screen' },
  ]);

  console.log('Bot started successfully.');
});
