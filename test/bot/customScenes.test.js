// test/bot/customScenes.test.js
//
const { customScenes } = require("../../bot");

const tests = ['hx12efwd', 'vsdgsds', 'hx0e040d8df7efd5784299ef3486b7188178b4a8c7', ' hx0e040d8df7efd5784299ef3486b7188178b4a8c7', 'hx0e040d8df7efd5784299ef3486b7188178b4a8c7 '];

tests.forEach( test => {
  console.log(`${test} ${customScenes.isValidICONWallet(test)}`);
});
