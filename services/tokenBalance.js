// tokenBalance.js
//
const customPath = require("./customPath.js");
const { methods } = require("../api");
const { hexToDecimalWithPrecision } = require("./lib.js");
const { icxGetBalance, balanceOf, decimals } = methods;
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
    let tokenDecimal = await decimals(wallet, tokenData.contract);
    tokenData.amount = {
      hex: tokenHexPrice.result,
      decimal: hexToDecimalWithPrecision(
        tokenHexPrice.result,
        tokenDecimal.result
      )
    };
    balance.push(tokenData);
  }
  return balance;
}
module.exports = tokenBalance;
