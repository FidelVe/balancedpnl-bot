// poolPrices.js
//
const { dex } = require("../api");
const fs = require("fs");
const customPath = require("./customPath.js");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));
const POOLS = DATA.pools;
const REGEX = new RegExp("IUSD");

async function poolPrices(pools = POOLS) {
  let newPoolsData = {};

  for (let pool of pools) {
    let price = await dex.getPrice(pool.id);

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

//async function poolPrices() {
//  const namedPools = await dex.getNamedPools();
//  let pools = {};

//  for (let poolName of namedPools.result) {
//    let price = await dex.getPriceByName(poolName);

//    //TODO: bypassing IUSD(C/T) related pools because of weird hex values
//    if (!REGEX.test(poolName)) {
//      pools[poolName] = {
//        price: price.result,
//        priceDecimal: REGEX.test(poolName) // always false
//          ? "0." + parseInt(price.result, 16).toString()
//          : parseInt(price.result, 16) / DATA.base
//      };
//    }
//  }
//  return pools;
//}
module.exports = poolPrices;
