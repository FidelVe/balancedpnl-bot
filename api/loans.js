// loansContractMethods.js
//
const httpsRequest = require("./httpsRequest");
const { customPath } = require("../services");
const makePostData = require("./makePostData.js");
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync(customPath("/data/data.json"), "utf8"));
const HTTPS_PARAMS = {
  hostname: DATA.node.ctz,
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

async function getAccountPositions(wallet) {
  const postData = makePostData({
    to: DATA.contracts.loans,
    dataType: "call",
    data: {
      method: "getAccountPositions",
      params: {
        _owner: wallet
      }
    }
  });

  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
}

module.exports.getAccountPositions = getAccountPositions;
