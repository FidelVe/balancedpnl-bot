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
const { model } = require("../model");

// Functions
const startCommandReplyText =
  "Hi!, welcome to the BalancedPNL Bot.\n\nYou can use this bot to track the PNL of a wallet with an open position in the Balanced Network. The bot gets the debt of a wallet and with the current price and amount of each token in the wallets it calculates the PNL.\n\nTo use the bot please click on the 'Add Wallet' button to add a wallet to track, you can see which wallets are you tracking by clicking in the 'Check Wallet' and you can delete wallets with the 'Delete Wallet' button.";

const infoCommandReplyText =
  "The following is a list of commands that you can use with this bot.\n\n* /start => Use this command to add, delete and view the wallets being tracked.\n* /info => With this command the bot will reply with this info message.\n* /pnl => Use this command to view the PNL of each wallet you have added and the overall PNL of all the wallets.\n* /assets => Use this command to get a summary of each wallet. The summary shows each token in the wallet, their balance and the prices in the pools for that token.\n* /summary => runs a /pnl and /assets check combined\n* /addsICX => Adds an sICX amount to the PNL calculation.";

async function checkPricesCreateReply(wallets) {
  let replies = await checkSummary(wallets);
  return replies.prices;
}

async function checkPNL(wallets) {
  let replies = await checkSummary(wallets);
  return replies.pnl;
}

async function checkSummary(wallets, currentUserId) {
  let replies = {
    pnl: "",
    prices: ""
  };
  let dataAllWallets = {
    value: 0,
    debt: 0,
    pnl: 0
  };

  const pools = await poolPrices();
  const poolPairs = Object.keys(pools);
  let priceOfAssetsInWallet = [];
  let customTokens = await tokenBalance.userDefinedTokenBalance(currentUserId);

  for (let eachWallet of wallets) {
    console.log(`running check on wallet ${eachWallet.address}.`);
    let newWalletObj = { address: eachWallet.address, tokens: [] };

    let accountData = await walletPosition(eachWallet.address);

    let tokens = await tokenBalance.tokenBalance(eachWallet.address);

    let overallWalletValueInBnUSD = await assetsValue(
      tokens,
      pools,
      currentUserId
    );
    let walletValueInBnUSD = overallWalletValueInBnUSD.totalValue;
    let walletValueInBnUSDWithoutCustom =
      overallWalletValueInBnUSD.totalValueWithoutCustom;

    let debtInBnUSD = lib.validateNumber(accountData.debt.BNUSD.decimal);
    let pnlInBnUSD = walletValueInBnUSD - debtInBnUSD;
    let pnlInBnUSDWithoutCustom = walletValueInBnUSDWithoutCustom - debtInBnUSD;
    let pnlInBnUSDAdjusted = pnlInBnUSD * 0.96;

    replies.pnl += `Wallet name: ${eachWallet.name}\nWallet address: ${
      eachWallet.address
    }\nWallet value in bnUSD: ${walletValueInBnUSD.toFixed(
      2
    )}.\nWallet value in bnUSD (without custom assets): ${walletValueInBnUSDWithoutCustom.toFixed(
      2
    )}\nWallet debt in bnUSD: ${debtInBnUSD.toFixed(
      2
    )}.\nWallet PNL in bnUSD (without custom assets): ${pnlInBnUSDWithoutCustom.toFixed(
      2
    )}\nWallet PNL in bnUSD: ${pnlInBnUSD.toFixed(
      2
    )}\nWallet PNL in bnUSD (4% adjusted): ${pnlInBnUSDAdjusted.toFixed(
      2
    )}\n\n`;

    dataAllWallets.value += walletValueInBnUSD;
    dataAllWallets.debt += debtInBnUSD;
    dataAllWallets.pnl += pnlInBnUSD;
    dataAllWallets.pnlAdjusted = dataAllWallets.pnl * 0.96;

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
  replies.pnl += `Overall:\nWallet value in bnUSD: ${dataAllWallets.value.toFixed(
    2
  )}.\nWallet debt in bnUSD: ${dataAllWallets.debt.toFixed(
    2
  )}.\nWallet PNL in bnUSD: ${dataAllWallets.pnl.toFixed(
    2
  )}\nWallet PNL in bnUSD (4% adjusted): ${dataAllWallets.pnlAdjusted.toFixed(
    2
  )}`;
  for (let wallet of priceOfAssetsInWallet) {
    replies.prices += `Wallet: ${wallet.address}\n`;
    for (let token of wallet.tokens) {
      replies.prices += `---\nToken: ${
        token.name
      }\nAmount: ${token.amount.toFixed(2)}\n`;
      for (let pair of Object.keys(token.pairs)) {
        replies.prices += `${pair}: ${token.pairs[pair].priceDecimal.toFixed(
          4
        )}\n`;
      }
    }
    replies.prices += "\n\n";
  }
  // Adding manually input assets from user to the reply
  replies.prices += customTokens;

  return replies;
}

function addsICX(command, currentUserId) {
  let db = model.readDb(currentUserId);
  db[currentUserId].assets.sICX = parseFloat(command[1]);
  model.writeDb(db);
  return `${command[1]} sICX added succesfully`;
}
function addUSD(command, currentUserId) {
  let db = model.readDb(currentUserId);
  db[currentUserId].assets.USD = parseFloat(command[1]);
  model.writeDb(db);
  return `${command[1]} USD added succesfully`;
}

// exports
module.exports = {
  startCommandReplyText: startCommandReplyText,
  infoCommandReplyText: infoCommandReplyText,
  checkPNL: checkPNL,
  checkPricesCreateReply: checkPricesCreateReply,
  checkSummary: checkSummary,
  addsICX: addsICX,
  addUSD: addUSD
};
