const backOrder = require("./backOrder");
const stockHM = require("./StockHM");
const xlsx = require('xlsx');

var newWB = xlsx.utils.book_new();
var checkList = stockHM();
(async () => {
  try {
    await backOrder.initialize();
    await backOrder.login();
    var newList =  await backOrder.search(checkList);
    var newListWS = xlsx.utils.json_to_sheet(newList);
    xlsx.utils.book_append_sheet(newWB, newListWS, "Stock Check Status");
    xlsx.writeFile(newWB,'StockCheck_Status.xlsx')
  } catch (err) {
    console.log(err);
  }
})();
