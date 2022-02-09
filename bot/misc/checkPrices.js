// bot/misc/checkPrices.js
//
const {
  poolPrices,
  walletPosition,
  tokenBalance,
  assetsValue,
  customPath,
  lib
} = require("../../services");

async function checkPrices(wallets) {
  const pools = await poolPrices();
  const poolPairs = Object.keys(pools);
  let priceOfAssetsInWallet = [];
  for (let wallet of wallets) {
    let newWalletObj = { address: wallet.address, tokens: [] };
    const tokens = await tokenBalance(wallet.address);
    for (let each of tokens) {
      if (each.amount.decimal > 0.1) {
        let tokenPoolPairs = {};
        for (let pair of poolPairs) {
          if (pair.split("/")[0] === each.name) {
            tokenPoolPairs[pair] = pools[pair];
          }
        }
        newWalletObj.tokens.push({
          name: each.name,
          amount: each.amount.decimal,
          pairs: tokenPoolPairs
        });
      }
    }
    priceOfAssetsInWallet.push(newWalletObj);
  }
  return priceOfAssetsInWallet;
}

async function checkPricesCreateReply(wallets) {
  const checkPricesReturnedObject = await checkPrices(wallets);
  let reply = "";

  for (let wallet of checkPricesReturnedObject) {
    reply += `Wallet: ${wallet.address}\n`;
    for (let token of wallet.tokens) {
      reply += `---\nToken: ${token.name}\nAmount: ${token.amount.toFixed(
        2
      )}\n`;
      for (let pair of Object.keys(token.pairs)) {
        reply += `${pair}: ${token.pairs[pair].priceDecimal.toFixed(4)}\n`;
      }
    }
    reply += "\n\n";
  }
  return reply;
}
