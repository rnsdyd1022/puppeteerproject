const neworder = require("./neworder/newOrder2.js");

(async () => {
  try {
    await neworder.initialize();
    await neworder.login();
    await neworder.processNeworder();
  } catch (err) {
    console.log(err);
  }
})();
