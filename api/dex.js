// getPriceByName.js
//
const httpsRequest = require("./httpsRequest");
const makePostData = require("./makePostData.js");
const { customPath } = require("../services");
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync(customPath("data/data.json"), "utf8"));
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
    return null;
  }
}

async function getPoolId(token1, token2) {
  const postData = makePostData({
    to: DATA.contracts.dex,
    dataType: "call",
    data: {
      method: "getPoolId",
      params: {
        _token1Address: token1,
        _token2Address: token2
      }
    }
  });
  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
}

async function getPoolStats(poolId) {
  const postData = makePostData({
    to: DATA.contracts.dex,
    dataType: "call",
    data: {
      method: "getPoolStats",
      params: {
        _id: poolId.toString()
      }
    }
  });
  const request = await customHttpsRequest(HTTPS_PARAMS, postData);
  return request;
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

async function getPrice(poolId) {
  const postData = makePostData({
    to: DATA.contracts.dex,
    dataType: "call",
    data: {
      method: "getPrice",
      params: {
        _id: poolId.toString()
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

module.exports = {
  getNamedPools: getNamedPools,
  getPriceByName: getPriceByName,
  getQuitePriceInBase: getQuotePriceInBase,
  getPoolId: getPoolId,
  getPrice: getPrice,
  getPoolStats: getPoolStats
};
