// loansContractMethods.test.js
//

const { loans } = require("../../api");
const { getAccountPositions } = loans;
const fs = require("fs");

const DATA = JSON.parse(fs.readFileSync("../data/data.json"));

(async () => {
  let results = {};
  try {
    let test1 = await getAccountPositions(DATA.wallets[0]);
    results.getAccountPositions = test1;
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
