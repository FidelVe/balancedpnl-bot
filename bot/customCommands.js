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
  "The following is a list of commands that you can use with this bot.\n\n* /start => Use this command to add, delete and view the wallets being tracker.\n* /info => With this command the bot will reply with this info message.\n* /check => Use this command to view the PNL of each wallet you have added and the overall PNL of all the wallets.";

async function checkPNL(wallets) {
  let reply = "";
  let dataAllWallets = {
    value: 0,
    debt: 0,
    pnl: 0
  };

  for (let eachWallet of wallets) {
    console.log(`running check on wallet ${eachWallet.address}.`);
    // let pools = await poolPrices();
    let pools = await poolPrices();
    let accountData = await walletPosition(eachWallet.address);
    let tokens = await tokenBalance(eachWallet.address);
    let walletValueInBnUSD = assetsValue(tokens, pools);

    let debtInBnUSD = lib.validateNumber(accountData.debt.BNUSD.decimal);
    let pnlInBnUSD = walletValueInBnUSD - debtInBnUSD;

    reply += `Wallet name: ${eachWallet.name}\nWallet address: ${
      eachWallet.address
    }\nWallet value in bnUSD: ${walletValueInBnUSD.toFixed(
      2
    )}.\nWallet debt in bnUSD: ${debtInBnUSD.toFixed(
      2
    )}.\nWallet PNL in bnUSD: ${pnlInBnUSD.toFixed(2)}\n\n`;

    dataAllWallets.value += walletValueInBnUSD;
    dataAllWallets.debt += debtInBnUSD;
    dataAllWallets.pnl += pnlInBnUSD;
  }

  reply += `Overall:\nWallet value in bnUSD: ${dataAllWallets.value.toFixed(
    2
  )}.\nWallet debt in bnUSD: ${dataAllWallets.debt.toFixed(
    2
  )}.\nWallet PNL in bnUSD: ${dataAllWallets.pnl.toFixed(2)}`;

  return reply;
}

// exports
exports.startCommandReplyText = startCommandReplyText;
exports.infoCommandReplyText = infoCommandReplyText;
exports.checkPNL = checkPNL;
