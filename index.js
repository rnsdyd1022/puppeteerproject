const neworder = require("./neworder/neworder");

(async () => {
  try {
    await neworder.initialize();
    await neworder.login();
    await neworder.processNeworder();
  } catch (err) {
    console.log(err);
  }
})();
