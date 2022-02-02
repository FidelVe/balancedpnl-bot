// priceImpact.js
//
const getPoolStatsResponse = {
  jsonrpc: "2.0",
  result: {
    base: "0x34d509ab7ba5c0482b056",
    base_decimals: "0x12",
    base_token: "cx2e6d0fc0eca04965d06038c8406093337f085fcf",
    min_quote: "0x80d434978cea4907",
    name: "CFT/sICX",
    price: "0x1cbe1c76ed2bcab",
    quote: "0x6d6c085fa2fa38000000",
    quote_decimals: "0x12",
    quote_token: "cx2609b924e33ef00b648a409245c7ea394c467824",
    total_supply: "0x1260e12e065ec06f17004"
  },
  id: 1
};

function hexToDecimalWithPrecision(value, decimals) {
  return parseInt(value, 16) / Number("1E" + parseInt(decimals, 16).toString());
}
/*
 * Estimates the result of a swap in a pool
 * @params {number} value
 * @params {{name: string, id: number}} pool
 */
function getSwapEstimate(value, stats = getPoolStatsResponse) {
  // given an amount (value) to swap for a especific token (token) in a pool
  // (pool). this fuctions returns the estimate amount to recieve in a swap.
  //
  //
  const tokenA = {
    liquidity: hexToDecimalWithPrecision(
      stats.result.base,
      stats.result.base_decimals
    )
  };
  const tokenB = {
    liquidity: hexToDecimalWithPrecision(
      stats.result.quote,
      stats.result.quote_decimals
    )
  };

  const poolFactor = tokenA.liquidity * tokenB.liquidity;
  const swapValue = tokenB.liquidity - poolFactor / (value + tokenA.liquidity);

  return swapValue;
}

let cftAmount = 50000;
let swapEstimate = getSwapEstimate(cftAmount);
console.log(swapEstimate);
