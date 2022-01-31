// methods.test.js
//
const { methods } = require("../../api");
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync("../data/data.json"));

(async () => {
  let results = {};
  try {
    let test1 = await methods.icxGetBalance(DATA.wallets[0]);
    results.icxGetBalance = test1;
    let test2 = await methods.balanceOf(DATA.wallets[0], DATA.contracts.cft);
    results.balanceOf = test2;
  } catch (err) {
    console.log("Error while running test");
    console.log(results);
    console.log(err);
  }

  const testBreak = "[========================================]";

  // print test results
  for (let i = 0; i < Object.keys(results).length; i++) {
    console.log(testBreak);
    console.log(`Test on ${Object.keys(results)[i]}`);
    console.log(results[Object.keys(results)[i]]);
  }
})();
