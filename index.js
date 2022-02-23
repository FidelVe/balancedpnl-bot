// index.js
//
require("dotenv").config();
const { Telegraf, session, Markup, Scenes } = require("telegraf");
const { customScenes, customCommands } = require("./bot");
const { customPath } = require("./services");
const { model } = require("./model");
const { updateUsersDb, readUsersDb, checkUsersDb } = model;
const fs = require("fs");

// Global Constants
const BOT_TOKEN = process.env.BOT_TOKEN;
const DATA = JSON.parse(fs.readFileSync(customPath("data/data.json")));

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
bot.command("/test", ctx => {
  console.log("test command", ctx.state);
});
// /^(\/addsICX+\s)+\d{0,}[\.]?\d{0,}$/
bot.hears(/^(\/\w+\s+\d*\.?\d*)$/, ctx => {
  // bot listen to any command followed by a number (i.e /addsICX 123);
  let command = ctx.message.text.split(" ");
  if (command[0].substring(1) === "addsICX") {
    // command sent: addsICX
    console.log("command: ", JSON.stringify(command));
    ctx.reply(customCommands.addsICX(command, ctx.from.id));
  }
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
bot.command("/assets", async ctx => {
  ctx.session = checkUsersDb(ctx.session, ctx.from.id);
  if (
    ctx.session[ctx.from.id].hasInitialized &&
    ctx.session[ctx.from.id].wallets.length > 0
  ) {
    ctx.reply("Running check, please wait a few seconds...");
    let reply = await customCommands.checkPricesCreateReply(
      ctx.session[ctx.from.id].wallets
    );
    ctx.reply(reply);
  } else {
    ctx.reply(
      "There are no wallets to check, use /start command to add wallets"
    );
  }
});
bot.command("/pnl", async ctx => {
  ctx.session = checkUsersDb(ctx.session, ctx.from.id);
  if (
    ctx.session[ctx.from.id].hasInitialized &&
    ctx.session[ctx.from.id].wallets.length > 0
  ) {
    ctx.reply("Running check, please wait a few seconds...");
    let reply = await customCommands.checkPNL(ctx.session[ctx.from.id].wallets);
    ctx.reply(reply);
  } else {
    ctx.reply(
      "There are no wallets to check, use /start command to add wallets"
    );
  }
});

bot.command("/summary", async ctx => {
  ctx.session = checkUsersDb(ctx.session, ctx.from.id);
  if (
    ctx.session[ctx.from.id].hasInitialized &&
    ctx.session[ctx.from.id].wallets.length > 0
  ) {
    ctx.reply("Running check, please wait a few seconds...");
    let replyBreak = "\n=====================\n";
    let replies = await customCommands.checkSummary(
      ctx.session[ctx.from.id].wallets,
      ctx.from.id
    );
    let reply =
      replyBreak +
      "PNL check:\n" +
      replies.pnl +
      replyBreak +
      "Assets check\n" +
      replies.prices;
    ctx.reply(reply);
  } else {
    ctx.reply(
      "There are no wallets to check, use /start command to add wallets"
    );
  }
});

// running bot
bot.launch();

bot.catch(err => {
  console.log("Bot Error:");
  console.log(err);
  console.log("Bot error, throwing unhandled exception");
  throw "Bot error, throwing exception";
});
// Catching uncaught exceptions
process.on("uncaughtException", err => {
  console.error("Uncaught error: ", err);
  process.exit(1);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
