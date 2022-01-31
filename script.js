// script.js
//
const { customCommands } = require("./bot");
const fs = require("fs");
require('dotenv').config();

let  WALLETS = [
  {
    name: process.env.WALLET_1_NAME,
    address: process.env.WALLET_1
  },
  {
    name: process.env.WALLET_2_NAME,
    address: process.env.WALLET_2
  }
];

async function run(wallets) {
  let reply = await customCommands.checkPNL(wallets);
  return reply;
}

(async () => {
  let result = await run(WALLETS);
  console.log(result);
})();
