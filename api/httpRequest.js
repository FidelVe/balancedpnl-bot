// ./api/httpsRequest.js
// Imports
//
const http = require("http");

/**
 * async http request wrapped in a promise
 * @param {Object} param - params for the http request
 * @param {string} param.hostname
 * @param {string} param.ip
 * @param {number} param.port
 * @param {number} param.timeout
 * @param {string} param.path
 */
async function httpRequest(params, data = false) {
  const promisifiedQuery = new Promise((resolve, reject) => {
    console.log("query ip: " + params.hostname);
    const query = http.request(params, res => {
      // Print status code on console
      console.log("Status Code: " + res.statusCode);

      // Process chunked data
      let rawData = "";
      res.on("data", chunk => {
        rawData += chunk;
      });

      // when request completed, pass the data to the 'resolve' callback
      res.on("end", () => {
        let data = JSON.parse(rawData);
        resolve(data);
      });

      // if error, print on console
      res.on("error", err => {
        console.log("Got error: ", +err.message);
      });
    });
    // If request timeout destroy request
    query.on("timeout", () => {
      console.log("timeout. destroying query");
      query.destroy();
    });
    // Handle query error
    query.on("error", err => {
      console.log("error running query, passing error to callback reject");
      reject(err);
    });
    if (data != false) {
      // If data param is passed into function then we assume the call is
      // for path '/api/v3' and method is 'POST' so we send a .write to
      // the server.
      //
      query.write(data);
    }
    // end request
    query.end();
  });
  // wait for the response and return it
  try {
    return await promisifiedQuery;
  } catch (err) {
    console.log("error while running promisifiedQuery");
    console.log(err);
    throw "error connecting to node";
  }
}

if (require.main === module) {
  // If its the main entry point of the app execute test
  //
  console.log("running test on httpRequest");

  (async () => {
    let test = await httpRequest(
      {
        hostname: "52.196.159.184",
        port: 9000,
        path: "/admin/chain/0x1"
      },
      false
    );
    console.log(test);
  })();
} else {
  // else, export as module
  module.exports = httpRequest;
}
