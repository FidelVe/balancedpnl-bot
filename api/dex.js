// getPriceByName.js
//
const httpsRequest = require("./httpsRequest");
const makePostData = require("./makePostData.js");
const { customPath } = require("../services");
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync(customPath("data/data.json"), "utf8"));
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

async function getPriceByName(name) {
  const postData = makePostData({
    to: DATA.contracts.dex,
    dataType: "call",
    data: {
      method: "getPriceByName",
      params: {
        _name: name
      }
    }
  });

  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
}

async function getQuotePriceInBase(value) {
  const postData = makePostData({
    to: DATA.contracts.dex,
    dataType: "call",
    data: {
      method: "getQuotePriceInBase",
      params: {
        _id: value
      }
    }
  });

  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
}
async function getNamedPools() {
  const postData = makePostData({
    to: DATA.contracts.dex,
    dataType: "call",
    data: {
      method: "getNamedPools"
    }
  });

  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
}

module.exports.getNamedPools = getNamedPools;
module.exports.getPriceByName = getPriceByName;
module.exports.getQuotePriceInBase = getQuotePriceInBase;
