// getPoolStats.js
//
const { dex } = require("../api");
const fs = require("fs");
const customPath = require("./customPath.js");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));
const POOLS = DATA.pools;
const REGEX = new RegExp("IUSD");

async function getPoolsStatsArray(pools = POOLS) {
  let newPoolsData = {};

  for (let pool of pools) {
    let price = await dex.getPoolStats(pool.id);

    //TODO: bypassing IUSD(C/T) related pools because of weird hex values
    if (!REGEX.test(pool.name)) {
      newPoolsData[pool.name] = {
        price: price.result,
        priceDecimal: REGEX.test(pool.name) // always false
          ? "0." + parseInt(price.result, 16).toString()
          : parseInt(price.result, 16) / DATA.base
      };
    }
  }
  return newPoolsData;
}

async function getPoolStats(poolId) {
  let stats = await dex.getPoolStats(poolId);

  return stats;
}

function hexToDecimalWithPrecision(value, decimals) {
  return parseInt(value, 16) / Number("1E" + parseInt(decimals, 16).toString());
}
/*
 * Estimates the result of a swap in a pool
 * @params {number} value
 * @params {{name: string, id: number}} pool
 */
async function getSwapEstimate(value, pool) {
  // given an amount (value) to swap for a especific token (token) in a pool
  // (pool). this fuctions returns the estimate amount to recieve in a swap.
  //
  //
  let results = {
    name: pool.name.split("/")[1]
  };
  const stats = await getPoolStats(pool.id);
  const tokenA = {
    name: pool.name.split("/")[0],
    liquidity: hexToDecimalWithPrecision(
      stats.result.base,
      stats.result.base_decimals
    )
  };
  const tokenB = {
    name: pool.name.split("/")[1],
    liquidity: hexToDecimalWithPrecision(
      stats.result.quote,
      stats.result.quote_decimals
    )
  };

  const poolFactor = tokenA.liquidity * tokenB.liquidity;
  const swapValue = tokenB.liquidity - poolFactor / (value + tokenA.liquidity);

  if (pool.id == 1) {
    let price = hexToDecimalWithPrecision(
      stats.result.price,
      stats.result.base_decimals
    );
    return value / price;
  }
  return swapValue;
}
module.exports = {
  getPoolsStatsArray: getPoolsStatsArray,
  getPoolStats: getPoolStats,
  getSwapEstimate: getSwapEstimate
};
