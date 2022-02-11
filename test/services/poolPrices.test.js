// poolStats.test.js
//
const { poolPrices, customPath } = require("../../services");
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json")));

const TEST_POOL = DATA.pools[18]; // FIN/bnUSD pool

async function test() {
  let pools = await poolPrices();
  return pools;
}

(async () => {
  let result = await test();
  console.log('test1');
  console.log(result);
})();
