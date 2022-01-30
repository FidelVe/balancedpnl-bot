// getPriceByName.js
//
const httpsRequest = require("./httpsRequest");

const makePostData = require("./makePostData.js");
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync("../data/data.json", "utf8"));

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

  const request = await customHttpsRequest(
    { hostname: DATA.node.geometry, ...DATA.param.api },
    postData
  );
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

  const request = await customHttpsRequest(
    { hostname: DATA.node.geometry, ...DATA.param.api },
    postData
  );
  return request;
}

module.exports.getNamedPools = getNamedPools;
module.exports.getPriceByName = getPriceByName;

// process.on("uncaughtException", err => {
//   console.error("Uncaught error: ", err);
//   process.exit(1);
// });
