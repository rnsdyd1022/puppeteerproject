const accounts = require("./config/config");
const sendMSG = require("./sendMSG/sendMSG");
const sleep = require("./function/sleep");
var title = "In Stock Linesheet";
var massage =
  "Hello, Please check attached file for our guarenteed in stock! We will ship asap";
var msgarr = [title, massage];
var lineSheet = "../linesheet.jpg";
(async () => {
  try {
    await sendMSG.initialize();
    await sendMSG.login("cezanne", accounts.password);
    await sendMSG.gotoCustomer();
    await sleep(500);
    await sendMSG.selectCustmorGroupe("CompanyName ", "shoplev");
    await sendMSG.send(msgarr, lineSheet);
  } catch (err) {
    console.log(err);
  }
})();
