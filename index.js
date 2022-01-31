// index.js
//
require("dotenv").config();
const { Telegraf, session, Markup, Scenes } = require("telegraf");
const { customScenes, customCommands } = require("./bot");
const { customPath } = require("./services");
const fs = require("fs");

// Global Constants
const BOT_TOKEN = process.env.BOT_TOKEN;
const DATA = JSON.parse(fs.readFileSync(customPath('data/data.json')));

//Functions
// Wizard Scenes
const startWizard = customScenes.startWizard;
const checkWizard = customScenes.checkWizard;
const deleteWizard = customScenes.deleteWizard;

// Creating bot instance
const bot = new Telegraf(BOT_TOKEN);
const stage = new Scenes.Stage([startWizard, checkWizard, deleteWizard]);
bot.use(session());
bot.use(stage.middleware());

// bot actions and commands
bot.action("_START", (ctx, next) => {
  ctx.scene.enter("START_WIZARD");
});
bot.action("_CHECK", (ctx, next) => {
  ctx.scene.enter("CHECK_WIZARD");
});
bot.action("_DELETE", (ctx, next) => {
  ctx.scene.enter("DELETE_WIZARD");
});
bot.command("start", ctx => {
  ctx.reply(
    customCommands.startCommandReplyText,
    Markup.inlineKeyboard([
      Markup.button.callback("Add Wallet", "_START"),
      Markup.button.callback("Check Wallet", "_CHECK"),
      Markup.button.callback("Delete Wallet", "_DELETE")
    ])
  );
});
bot.command("/info", ctx => {
  ctx.reply(customCommands.infoCommandReplyText);
});
bot.command("/check", async ctx => {
  if (ctx.session.hasInitialized) {
    let reply = await customCommands.checkPNL(ctx.session.wallets);
    ctx.reply(reply);
  }
  ctx.reply("There are no wallets to check, use /start command to add wallets");
});

// running bot
bot.launch();

// Catching uncaught exceptions
process.on("uncaughtException", err => {
  console.error("Uncaught error: ", err);
  process.exit(1);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
