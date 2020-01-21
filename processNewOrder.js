const neworder = require("./neworder/newOrder2.js");

(async () => {
  try {
    await neworder.initialize();
    await neworder.login();
    await neworder.processNeworder().then(() => {
      console.log("Processing new order finished");
    });
  } catch (err) {
    console.log(err);
  }
})();
