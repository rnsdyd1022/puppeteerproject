const xlsx = require("xlsx");
const stockfile = "../../Desktop/HM_stock.xlsx";

const readStock = () => {
    const wb = xlsx.readFile(stockfile);
    const ws = wb.Sheets[wb.SheetNames[0]];

    const data = xlsx.utils.sheet_to_json(ws);


    var stockList = data.map(record => {
    
       // if(record.QUANTITY === 0) {
       //     delete record;
       // }
        
        var styleNum = record.STYLENUM;
        console.log(styleNum);
        if (styleNum.indexOf("PLUS") < 0 ) {
            record.SIZE = "R";
        }
        else if(styleNum.indexOf("PLUS") > 0 ){
            record.SIZE = "PLUS";
            record.STYLENUM = styleNum.slice(0,styleNum.indexOf("PLUS")).trim();
        }
        return record;
    })
   console.log(stockList);
   return stockList;
}

module.exports = readStock;