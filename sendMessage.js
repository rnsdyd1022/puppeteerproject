const accounts = require("./config/config");
const sendMSG = require("./sendMSG/sendMSG");
const sleep = require("./function/sleep");
var title = "Please check Our inStock LineSheet";
var massage =
  "Hello, Please check attached file for our garenteed instock! We will ship asap";
var msgarr = [title, massage];
var lineSheet = "../linesheet.pdf";
(async () => {
  try {
    await sendMSG.initialize();
    await sendMSG.login("cezanne", accounts.password);
    await sendMSG.gotoCustomer();
    await sleep(500);
    await sendMSG.selectCustmorGroupe("Company Name", "shoplev");
    await sendMSG.send(msgarr, lineSheet);
  } catch (err) {
    console.log(err);
  }
})();
