// poolStats.test.js
//
const { getPoolStats, customPath } = require("../../services");
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json")));

const TEST_POOL = DATA.pools[18]; // FIN/bnUSD pool

async function test() {
  const swap = await getPoolStats.getSwapEstimate(190, TEST_POOL);
  return swap;
}

async function test2() {
  const pools = await getPoolStats.getPoolsStatsArray();
  return pools;
}

(async () => {
  //let result = await test();
  //console.log(result);

  let result2 = await test2();
  console.log('result test2');
  //console.log(result2);
})();
