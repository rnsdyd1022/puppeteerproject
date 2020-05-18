const xlsx = require("xlsx");
const newOrderInvenfile = "../../Desktop/NewOrderInven.xlsx";

const formatStyleNumber = () => {
  var wb = xlsx.readFile(newOrderInvenfile);
  var ws = wb.Sheets[wb.SheetNames[0]];
  var data = xlsx.utils.sheet_to_json(ws);

  console.log(data);
  data.map(row => {
    let styleNumber = row.Target;
    if (styleNumber.indexOf("PLUS") < 0 && styleNumber.indexOf(" ") > 0) {
      row.Target = styleNumber.slice(0, styleNumber.indexOf(" ")).trim();
    } else if (styleNumber.indexOf("PLUS") > 0) {
      row.Target = styleNumber.slice(0, styleNumber.indexOf("PLUS") + 4).trim();
    } else if (styleNumber.indexOf("PLU") > 0) {
      row.Target = styleNumber.slice(0, styleNumber.indexOf("PLUS") + 3).trim();
    } else if (styleNumber.indexOf("PL") > 0) {
      row.Target = styleNumber.slice(0, styleNumber.indexOf("PLUS") + 2).trim();
    } else if (styleNumber.indexOf("IN") > 0) {
      row.Target = styleNumber.slice(0, styleNumber.indexOf("IN")).trim();
    } else if (styleNumber.indexOf("CUT") > 0) {
      row.Target = styleNumber.slice(0, styleNumber.indexOf("CUT")).trim();
    } else if (styleNumber.indexOf("_") > 0) {
      row.Target = styleNumber.slice(0, styleNumber.indexOf("_")).trim();
    }

    if (row.Target[row.Target.length - 1] == "-") {
      row.Target = row.Target.slice(0, row.Target.length - 1);
    }
  });

  console.log(data);
  var formattedStyleNumberWS = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, formattedStyleNumberWS, "Formatted");

  xlsx.writeFile(wb, newOrderInvenfile);
};

formatStyleNumber();
