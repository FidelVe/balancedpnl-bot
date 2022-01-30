// httpRequest.test.js
const httpsRequest = require('../../api/httpsRequest');

(async () => {
  let test = await httpsRequest(
    {
      hostname: "api.icon.geometry.io",
      path: "/admin/chain/0x1"
    });
  console.log(test);
})();
