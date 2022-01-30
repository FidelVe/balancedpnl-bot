// DEXContractMethods.test.js
//

const { DEXContractMethods } = require("../../api");
const { getNamedPools, getPriceByName } = DEXContractMethods;

(async () => {
  let results = {};
  try {
    let getNamedPoolsTest = await getNamedPools();
    results.getNamedPoolsTest = getNamedPoolsTest;
    let getPriceByNameTest = await getPriceByName(getNamedPoolsTest.result[0]);
    results.getPriceByNameTest = getPriceByNameTest;
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
