// bot/misc/checkPNL.js
//
const {
  poolPrices,
  walletPosition,
  tokenBalance,
  assetsValue,
  customPath,
  lib
} = require("../../services");

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
