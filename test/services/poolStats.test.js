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

(async () => {
  let result = await test();
  console.log(result);
})();
