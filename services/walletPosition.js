// walletPosition.js
//
const { loans } = require("../api");
const fs = require("fs");
const customPath = require("./customPath.js");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));

async function walletPosition(wallet) {
  const account = await loans.getAccountPositions(wallet);

  let result = {
    address: wallet,
    debt: {
      BNUSD: { hex: "0x0", decimal: 0 },
      ICX: { hex: "0x0", decimal: 0 }
    },
    collateral: {
      SICX: { hex: "0x0", decimal: 0 },
      ICX: { hex: "0x0", decimal: 0 }
    }
  };

  if (typeof account.result.message === "undefined") {
    result = {
      address: account.result.address,
      debt: {
        BNUSD: {
          hex: account.result.assets.bnUSD ?? "0x0",
          decimal: parseInt(account.result.assets.bnUSD, 16) / DATA.base || 0
        },
        ICX: {
          hex: account.result.total_debt ?? "0x0",
          decimal: parseInt(account.result.total_debt, 16) / DATA.base || 0
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
  return result;
}
module.exports = walletPosition;
