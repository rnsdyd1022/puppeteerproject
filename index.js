const neworder = require("./neworder");

(async () => {
  try {
    await neworder.initialize();
    await neworder.login();
  } catch (err) {
    console.log(err);
  }
})();
