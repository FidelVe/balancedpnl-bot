// bot/customCommands.js
//
const {
  poolPrices,
  walletPosition,
  tokenBalance,
  assetsValue,
  customPath,
  lib
} = require("../services");
const fs = require("fs");
const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json")));

// Functions
const startCommandReplyText =
  "Hi!, welcome to the BalancedPNL Bot.\n\nYou can use this bot to track the PNL of a wallet with an open position in the Balanced Network. The bot gets the debt of a wallet and with the current price and amount of each token in the wallets it calculates the PNL.\n\nTo use the bot please click on the 'Add Wallet' button to add a wallet to track, you can see which wallets are you tracking by clicking in the 'Check Wallet' and you can delete wallets with the 'Delete Wallet' button.";

const infoCommandReplyText =
  "The following is a list of commands that you can use with this bot.\n\n* /start => Use this command to add, delete and view the wallets being tracker.\n* /info => With this command the bot will reply with this info message.\n* /check => Use this command to view the PNL of each wallet you have added and the overall PNL of all the wallets.\n* /assets => Use this command to get a summary of each wallet. The summary shows each token in the wallet, their balance and the prices in the pools for that token.";

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

async function checkPNL(wallets) {
  let reply = "";
  let dataAllWallets = {
    value: 0,
    debt: 0,
    pnl: 0
  };

  const pools = await poolPrices();
  for (let eachWallet of wallets) {
    console.log(`running check on wallet ${eachWallet.address}.`);
    let accountData = await walletPosition(eachWallet.address);
    let tokens = await tokenBalance(eachWallet.address);
    let walletValueInBnUSD = await assetsValue(tokens, pools);

    let debtInBnUSD = lib.validateNumber(accountData.debt.BNUSD.decimal);
    let pnlInBnUSD = walletValueInBnUSD - debtInBnUSD;
    let pnlInBnUSDAdjusted = pnlInBnUSD * 0.96;

    reply += `Wallet name: ${eachWallet.name}\nWallet address: ${
      eachWallet.address
    }\nWallet value in bnUSD: ${walletValueInBnUSD.toFixed(
      2
    )}.\nWallet debt in bnUSD: ${debtInBnUSD.toFixed(
      2
    )}.\nWallet PNL in bnUSD: ${pnlInBnUSD.toFixed(
      2
    )}\nWallet PNL in bnUSD (4% adjusted): ${pnlInBnUSDAdjusted.toFixed(
      2
    )}\n\n`;

    dataAllWallets.value += walletValueInBnUSD;
    dataAllWallets.debt += debtInBnUSD;
    dataAllWallets.pnl += pnlInBnUSD;
    dataAllWallets.pnlAdjusted = dataAllWallets.pnl * 0.96;
  }

  reply += `Overall:\nWallet value in bnUSD: ${dataAllWallets.value.toFixed(
    2
  )}.\nWallet debt in bnUSD: ${dataAllWallets.debt.toFixed(
    2
  )}.\nWallet PNL in bnUSD: ${dataAllWallets.pnl.toFixed(
    2
  )}\nWallet PNL in bnUSD (4% adjusted): ${dataAllWallets.pnlAdjusted.toFixed(
    2
  )}`;

  return reply;
}

// exports
exports.startCommandReplyText = startCommandReplyText;
exports.infoCommandReplyText = infoCommandReplyText;
exports.checkPNL = checkPNL;
exports.checkPrices = checkPrices;
exports.checkPricesCreateReply = checkPricesCreateReply;
