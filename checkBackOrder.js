const backOrder = require("./backOrder/backOrder");
const readStock = require("./function/readStock");
const xlsx = require('xlsx');

var newWB = xlsx.utils.book_new();
var checkList = readStock();
(async () => {
  try {
    await backOrder.initialize();
    await backOrder.login();
    var newList =  await backOrder.search(checkList);
    var newListWS = xlsx.utils.json_to_sheet(newList);
    xlsx.utils.book_append_sheet(newWB, newListWS, "Stock Check Status");
    xlsx.writeFile(newWB,'StockCheck_Status.xlsx')
    await backOrder.end().then(console.log("Backorder Check completed"));
  } catch (err) {
    console.log(err);
  }
})();
