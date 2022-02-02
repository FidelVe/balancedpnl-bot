// getPoolsId.js
//
const { customPath } = require("../services");
const { dex } = require("../api");
const fs = require("fs");
const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json")));

const TOKENS = DATA.tokens;
const TOKEN_DATA = DATA.token_data;
let POOLS = DATA.pools;
const BALANCED_CONTRACTS = DATA.contracts;

async function getPoolsId() {
  let newPoolsData = [];
  for (let pool of POOLS) {
    const poolName = pool.name.split("/");
    const token1 = poolName[0];
    const token2 = poolName[1];

    if(pool.name === "sICX/ICX") {
      newPoolsData.push({name: "sICX/ICX", id: 1});
    } else {
      const token1Contract = TOKEN_DATA[token1].contract;
      const token2Contract = TOKEN_DATA[token2].contract;
      const id = await dex.getPoolId(token1Contract, token2Contract);

      newPoolsData.push({
        name: pool.name,
        id: parseInt(id.result, 16)
      });
    }
  }
  return newPoolsData;
}

(async () => {
  let result = await getPoolsId();
  console.log(JSON.stringify(result));
})()
