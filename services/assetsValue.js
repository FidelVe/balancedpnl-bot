// assetsValue.js
//
const fs = require("fs");
const customPath = require("./customPath.js");
const { getSwapEstimate } = require("./poolStats");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));
// [CFT, SICX, BNUSD, BALN, OMM, METX, GBET];
const TOKEN_NAMES = DATA.tokens;

function toBnusd(token, pools, tag) {
  // convert token to bnusd
  return token * pools[tag].priceDecimal;
}

function getCorrectPool(tag) {
  let correctPool = null;

  for (let pool of DATA.pools) {
    if (pool.name === tag) {
      correctPool = pool;
      break;
    } else {
    }
  }
  return correctPool;
}

async function assetsValue(tokens, prices) {
  let totalValue = 0;

  for (let token of tokens) {
    if (token.name === "ICX") {
      // if token is ICX
      let toSICX = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("ICX/sICX")
      );
      let toBnUSD = await getSwapEstimate(toSICX, getCorrectPool("sICX/bnUSD"));
      totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[0]) {
      // if token is CFT
      // CFT > SICX
      let toSICX = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("CFT/sICX")
      );
      let toBnUSD = await getSwapEstimate(toSICX, getCorrectPool("sICX/bnUSD"));
      totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[1]) {
      // if token is SICX
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("sICX/bnUSD")
      );
      totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[2]) {
      // if token is BNUSD
      totalValue += token.amount.decimal;
    } else if (token.name === TOKEN_NAMES[3]) {
      // if token is BALN
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("BALN/bnUSD")
      );
      totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[4]) {
      // token is OMM
      let toSICX = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("OMM/sICX")
      );
      let toBnUSD = await getSwapEstimate(toSICX, getCorrectPool("sICX/bnUSD"));
      totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[5]) {
      // token is METX
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("METX/bnUSD")
      );
      totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[6]) {
      // token is GBET
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("GBET/bnUSD")
      );
      totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[7]) {
      // token is FIN
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("FIN/bnUSD")
      );
      totalValue += toBnUSD;
    } else {
      console.error(`Token not found. ${token.name}`);
    }
  }

  return totalValue;
}

module.exports = assetsValue;
