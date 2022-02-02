// assetsValue.js
//
const fs = require("fs");
const customPath = require("./customPath.js");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));
// [CFT, SICX, BNUSD, BALN, OMM, METX, GBET];
const TOKEN_NAMES = DATA.tokens;

function toBnusd(token, pools, tag) {
  // convert token to bnusd
  return token * pools[tag].priceDecimal;
}

function assetsValue(tokens, prices) {
  let totalValue = 0;

  for (let token of tokens) {
    if (token.name === "ICX") {
      // if token is ICX
      let toSICX = token.amount.decimal * prices["sICX/ICX"].priceDecimal;
      totalValue += toBnusd(toSICX, prices, "sICX/bnUSD");
    } else if (token.name === TOKEN_NAMES[0]) {
      // if token is CFT
      // CFT > SICX
      let toSICX = token.amount.decimal * prices["CFT/sICX"].priceDecimal;
      totalValue += toBnusd(toSICX, prices, "sICX/bnUSD");
    } else if (token.name === TOKEN_NAMES[1]) {
      // if token is SICX
      totalValue += toBnusd(token.amount.decimal, prices, "sICX/bnUSD");
    } else if (token.name === TOKEN_NAMES[2]) {
      // if token is BNUSD
      totalValue += token.amount.decimal;
    } else if (token.name === TOKEN_NAMES[3]) {
      // if token is BALN
      totalValue += toBnusd(token.amount.decimal, prices, "BALN/bnUSD");
    } else if (token.name === TOKEN_NAMES[4]) {
      // token is OMM
      let toSICX = token.amount.decimal * prices["OMM/sICX"].priceDecimal;
      totalValue += toBnusd(toSICX, prices, "sICX/bnUSD");
    } else if (token.name === TOKEN_NAMES[5]) {
      // token is METX
      totalValue += toBnusd(token.amount.decimal, prices, "METX/bnUSD");
    } else if (token.name === TOKEN_NAMES[6]) {
      // token is GBET
      totalValue += toBnusd(token.amount.decimal, prices, "GBET/bnUSD");
    } else if (token.name === TOKEN_NAMES[7]) {
      // token is FIN
      let toSICX = token.amount.decimal * prices["FIN/sICX"].priceDecimal;
      totalValue += toBnusd(toSICX, prices, "sICX/bnUSD");
    } else {
      console.error(`Token not found. ${token.name}`);
    }
  }

  return totalValue;
}

module.exports = assetsValue;
