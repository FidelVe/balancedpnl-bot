// makeData.js
//
function makePostData(params = null, method = "icx_call", id = 1) {
  let data = {
    jsonrpc: "2.0",
    method: method,
    id: id,
    params: params
  };

  if (params === null) {
    throw "params cannot be null";
  }

  return JSON.stringify(data);
}

module.exports = makePostData;
