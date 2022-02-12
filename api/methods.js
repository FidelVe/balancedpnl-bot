// methods.js
//
const httpsRequest = require("./httpsRequest");
const makePostData = require("./makePostData.js");
const { customPath } = require("../services");
const fs = require("fs");
const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));

const HTTPS_PARAMS = {
  hostname: DATA.node.geometry,
  ...DATA.param.api
};

async function customHttpsRequest(params, data) {
  try {
    const request = await httpsRequest(params, data);
    return request;
  } catch (err) {
    console.log("Error running customHttpsRequest");
    console.log(err);
  }
}

async function icxGetBalance(wallet) {
  const postData = makePostData({ address: wallet }, "icx_getBalance");

  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
}

async function decimals(wallet, contract) {
  const postData = makePostData({
    to: contract,
    dataType: "call",
    data: {
      method: "decimals"
    }
  });

  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
}
async function balanceOf(wallet, contract) {
  const postData = makePostData({
    to: contract,
    dataType: "call",
    data: {
      method: "balanceOf",
      params: {
        _owner: wallet
      }
    }
  });

  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
}
module.exports.balanceOf = balanceOf;
module.exports.icxGetBalance = icxGetBalance;
module.exports.decimals = decimals;
