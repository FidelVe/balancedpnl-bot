// poolPrices.js
//
const { dex } = require("../api");
const fs = require("fs");
const customPath = require("./customPath.js");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));

const regex = new RegExp("IUSD");

async function poolPrices() {
  const namedPools = await dex.getNamedPools();
  let pools = {};

  for (let poolName of namedPools.result) {
    let price = await dex.getPriceByName(poolName);

    //TODO: bypassing IUSD(C/T) related pools because of weird hex values
    if (!regex.test(poolName)) {
      pools[poolName] = {
        price: price.result,
        priceDecimal: regex.test(poolName) // always false
          ? "0." + parseInt(price.result, 16).toString()
          : parseInt(price.result, 16) / DATA.base
      };
    }
  }
  return pools;
}
//poolPrices();
module.exports = poolPrices;
