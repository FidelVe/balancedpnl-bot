// walletPosition.js
//
const { loans } = require("../api");
const fs = require("fs");
const customPath = require("./customPath.js");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));

async function walletPosition(wallet) {
  const account = await loans.getAccountPositions(wallet);
  return {
    address: account.result.address,
    debt: {
      BNUSD: {
        hex: account.result.assets.bnUSD,
        decimal: parseInt(account.result.assets.bnUSD, 16) / DATA.base
      },
      ICX: {
        hex: account.result.total_debt,
        decimal: parseInt(account.result.total_debt, 16) / DATA.base
      }
    },
    collateral: {
      SICX: {
        hex: account.result.assets.sICX,
        decimal: parseInt(account.result.assets.sICX, 16) / DATA.base
      },
      ICX: {
        hex: account.result.collateral,
        decimal: parseInt(account.result.collateral, 16) / DATA.base
      }
    }
  };
}
module.exports = walletPosition;
