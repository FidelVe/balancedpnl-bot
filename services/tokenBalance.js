// tokenBalance.js
//
const customPath = require("./customPath.js");
const { methods } = require("../api");
const { icxGetBalance, balanceOf } = methods;
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));

async function tokenBalance(wallet) {
  let balance = [];
  let icx = await icxGetBalance(wallet);
  balance.push({
    name: "ICX",
    amount: {
      hex: icx.result,
      decimal: parseInt(icx.result, 16) / DATA.base
    }
  });

  for (let token of DATA.tokens) {
    let tokenData = { name: token, contract: DATA.token_data[token].contract };
    let tokenHexPrice = await balanceOf(wallet, tokenData.contract);
    tokenData.amount = {
      hex: tokenHexPrice.result,
      decimal: parseInt(tokenHexPrice.result, 16) / DATA.base
    };
    balance.push(tokenData);
  }
  return balance;
}
module.exports = tokenBalance;
