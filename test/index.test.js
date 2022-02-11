// script.test.js
//
require("dotenv").config();
// const { botCommands, botReplyMaker } = require("../bot");
// const { customPath } = require("../services");
const { customCommands } = require("../bot");
const fs = require("fs");

const MONITORED = [
  { name: process.env.WALLET_1_NAME, address: process.env.WALLET_1 },
  { name: process.env.WALLET_2_NAME, address: process.env.WALLET_2 }
];

class Bot {
  constructor(wallets) {
    this.wallets = wallets;
    this.replyBreak = "\n===============================\n";
  }

  async assets() {
    console.log("test on /assets");
    let reply = await customCommands.checkPricesCreateReply(this.wallets);
    console.log(this.replyBreak);
    console.log(reply);
    console.log(this.replyBreak);
  }

  async pnl() {
    console.log("test on /pnl");
    let reply = await customCommands.checkPNL(this.wallets);
    console.log(this.replyBreak);
    console.log(reply);
    console.log(this.replyBreak);
  }

  async summary() {
    console.log("test on /summary");
    let replies = await customCommands.checkSummary(this.wallets);
    let reply =
      this.replyBreak +
      "PNL check:\n" +
      replies.pnl +
      this.replyBreak +
      "Assets check:\n" +
      replies.prices +
      this.replyBreak;
    console.log(reply);
  }
}

(async () => {
  let newBot = new Bot(MONITORED);
  console.log("Running tests on bot commands");
  // test command /assets
  // newBot.assets();

  // test command /pnl
  // newBot.pnl();

  // test command /summary
  newBot.summary();
})();
