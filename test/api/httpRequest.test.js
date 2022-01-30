// httpRequest.test.js
const httpRequest = require('../../api/httpRequest');

(async () => {
  let test = await httpRequest(
    {
      hostname: "52.196.159.184",
      port: 9000,
      path: "/admin/chain/0x1"
    });
  console.log(test);
})();
