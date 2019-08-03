const backOrder = require("./backOrder");
const stockHM = require("./StockHM");


var checkList = stockHM();
(async () => {
  try {
    await backOrder.initialize();
    await backOrder.login();
    await backOrder.search(checkList);
  } catch (err) {
    console.log(err);
  }
})();
