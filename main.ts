import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.19.0/mod.ts";
import jackrabbit from "npm:@pager/jackrabbit";

const rabbit = jackrabbit(Deno.env.get("AMQPS_URL"));

var exchange = rabbit.default();
var pushQueue = exchange.queue({ name: 'push-queue', durable: true });

const bot = new Bot(Deno.env.get("BOT_TOKEN"));

bot.command('queue', async ctx => {
  const count = Number(ctx.match);
  if (!ctx.match || isNaN(count)) {
    await ctx.reply('Usage: /queue <count>');
    return;
  }

  for (let i = 0; i < count; i++) {
    await exchange.publish(
      { chat_id: "some chat id", text: `Test text ${i}` },
      { key: 'push-queue' },
    );
  }
  await ctx.reply('Task has been scheduled');
});

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === '/amqp-push') {
      console.log(JSON.stringify(req));
      const { chat_id, text } = await req.json();
      await bot.api.sendMessage(chat_id, text);
      return new Response('ok', { status: 200 });
    } else if (path === '/telegram') {
      await webhookCallback(bot, 'std/http')(req);
      return new Response('ok', { status: 200 });
    } else {
      return new Response('not found', { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response(err, { status: 500 });
  }
});
