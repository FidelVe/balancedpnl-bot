// assetsValue.js
//
const fs = require("fs");
const customPath = require("./customPath.js");
const { getSwapEstimate } = require("./poolStats");
const { model } = require("../model");

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

async function assetsValue(tokens, prices, currentUserId) {
  let totalValue = 0;
  let result = { totalValue: 0, totalValueWithoutCustom: 0 };
  let db = model.readDb(currentUserId);

  if (db[currentUserId] == null) {
    // if not custom assets has been added to user profile
  } else {
    for (let token of Object.keys(db[currentUserId].assets)) {
      // adding up total value of assets manually entered by user
      if (token === "sICX") {
        let amount = db[currentUserId].assets[token];
        let correctPool = getCorrectPool("sICX/bnUSD");
        let toBnUSD = await getSwapEstimate(amount, correctPool);
        result.totalValue += toBnUSD;
        result.totalValueWithoutCustom += toBnUSD;
      } else if (token === "bnUSD") {
        result.totalValue += db[currentUserId].assets[token];
        result.totalValueWithoutCustom += db[currentUserId].assets[token];
      }
    }
  }

  for (let token of tokens) {
    console.log("token: ", token);
    // adding up the total value of the assets in the wallet
    if (token.name === "ICX") {
      // if token is ICX
      let toSICX = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("ICX/sICX")
      );
      let toBnUSD = await getSwapEstimate(toSICX, getCorrectPool("sICX/bnUSD"));
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[0]) {
      // if token is CFT
      // CFT > SICX
      let toSICX = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("CFT/sICX")
      );
      let toBnUSD = await getSwapEstimate(toSICX, getCorrectPool("sICX/bnUSD"));
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[1]) {
      // if token is SICX
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("sICX/bnUSD")
      );
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[2]) {
      // if token is BNUSD
      result.totalValue += token.amount.decimal;
    } else if (token.name === TOKEN_NAMES[3]) {
      // if token is BALN
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("BALN/bnUSD")
      );
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[4]) {
      // token is OMM
      let toSICX = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("OMM/sICX")
      );
      let toBnUSD = await getSwapEstimate(toSICX, getCorrectPool("sICX/bnUSD"));
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[5]) {
      // token is METX
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("METX/bnUSD")
      );
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[6]) {
      // token is GBET
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("GBET/bnUSD")
      );
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[7]) {
      // token is FIN
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("FIN/bnUSD")
      );
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[8]) {
      // token is IUSDT
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("IUSDT/bnUSD")
      );
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[9]) {
      // token is USDS
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("USDS/bnUSD")
      );
      result.totalValue += toBnUSD;
    } else if (token.name === TOKEN_NAMES[10]) {
      // token is IUSDC
      let toBnUSD = await getSwapEstimate(
        token.amount.decimal,
        getCorrectPool("IUSDC/bnUSD")
      );
      result.totalValue += toBnUSD;
    } else {
      console.error(`Token not found. ${token.name}`);
    }
  }

  result.totalValueWithoutCustom =
    result.totalValue - result.totalValueWithoutCustom;
  return result;
}

module.exports = assetsValue;
