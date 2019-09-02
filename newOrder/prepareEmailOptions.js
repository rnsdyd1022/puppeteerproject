const xlsx = require("xlsx");

const wb = xlsx.readFile("../../newOrderSheet.xlsx");
const ws = wb.Sheets[wb.SheetNames[0]];
const orders = xlsx.utils.sheet_to_json(ws);

let mailOptions = {
  from: "order.styleinusa@gmail.com",
  to: "rnsdyd1022@gmail.com",
  subject: "[PURCHASE ORDER] - STLYE IN USA",
  text: " "
};
const mailsOptions = [];
for (let i = 0; i < orders.length; i++) {
  let styleNumber = orders[i].StyleNum;
  let vc = styleNumber.slice(0, styleNumber.indexOf("-"));
}
