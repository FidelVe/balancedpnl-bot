// poolStats.test.js
//
const { getPoolStats, customPath } = require("../../services");
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json")));

const TEST_POOL = DATA.pools[18]; // FIN/bnUSD pool
const TEST_POOL2 = DATA.pools[9]; // sICX/bnUSD pool

async function getSwapEstimateTest(value, pool) {
  const swap = await getPoolStats.getSwapEstimate(value, pool);
  return swap;
}

async function getPoolsStatsArray() {
  const pools = await getPoolStats.getPoolsStatsArray();
  return pools;
}

(async () => {
  let test1 = await getSwapEstimateTest(5000, TEST_POOL2);
  console.log(`test1:\nsICX: 5000\nPool: ${JSON.stringify(TEST_POOL2)}\nResult: ${test1}\n\n`);
})();
