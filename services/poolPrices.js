// poolPrices.js
//
const { dex } = require("../api");
const { getPoolsStatsArray } = require("./poolStats.js");
const fs = require("fs");
const customPath = require("./customPath.js");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));
const POOLS = DATA.pools;
const REGEX = new RegExp("IUSD");

async function poolPrices(pools = POOLS) {
  let newPoolsData = {};
  let poolStats = await getPoolsStatsArray(pools);

  for (let poolName in poolStats) {
    newPoolsData[poolName] = {
      price: poolStats[poolName].price.price,
      priceDecimal: poolStats[poolName].priceDecimal
    };
  }
  return newPoolsData;
}
module.exports = poolPrices;
