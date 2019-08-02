const fs= require("fs");
const testfolder = "../../Downloads/";
const xlsx = require("xlsx");
const accounts = require("./config/config");

const cezanne = {
    code: "1604",
    startingNum: 1
};
const styleinusa = {
    code:"1459",
    startingNum: 301
};
const btween = {
    code:"2108",
    startingNum: 501
}
const appleb = {
    code:"2432",
    startingNum:601
}
const nadia = {
    code:"1428",
    startingNum:801
}

// read the directory,store filenames to arr
// and return array.
const readDirectory = async (folder) => {
    const files = await fs.readdirSync(folder);
        files.forEach(file=>{
            console.log(file);
        });
        return files;
}
  
const combineFiles = () => {
   const files = fs.readdirSync(testfolder);
    console.log(files);

    const date = new Date().toISOString().slice(8, 10);
    console.log(date);

    var newWB = xlsx.utils.book_new();
    for( let i = 0; i < files.length - 1; i++) {
        var wb = xlsx.readFile(testfolder + files[i], {cellDates:true});
        console.log(wb.SheetNames);

        var ws = wb.Sheets[wb.SheetNames[0]];

        var orders = xlsx.utils.sheet_to_json(ws);
        var po = orders[0].poNumber[0];

        var comfirmNum = startingNum(po);
        
        console.log(comfirmNum);

        
        var newOrders = orders.map((record)=> {
            delete record.payment;
            delete record.shipment;
            delete record.phoneNumber;
            delete record.billingStreet;
            delete record.billingCity;
            delete record.billingState;
            delete record.billingZipcode;
            delete record.billingCountry;   
            delete record.shippingStreet;
            delete record.shippingCity;
            delete record.shippingState;
            delete record.shippingZipcode;
            delete record.shippingCountry;   
            delete record.fax; 
            record.ComfirmDate = date + "=" + comfirmNum;
            comfirmNum++;
            return record;
        })
        var newWS = xlsx.utils.json_to_sheet(newOrders);
        xlsx.utils.book_append_sheet(newWB,newWS,"new");
    //    console.log(newOrders);
    }
    xlsx.writeFile(newWB,"Over all po info.xlsx");
}


const startingNum = (ab)=> {
    var num = 0;
    if(ab === "C") {
        num = 1;
    } else if ( ab === "O") {
        num = 301
    } else if ( ab === "H") {
        num = 501
    } else if ( ab === "A") {
        num = 601
    } else if ( ab === "N") {
        num = 801
    }

    return num;
}
/* 
(async () => {
    try {
       const files = await readDirectory(testfolder);
    } catch (err) {
      console.log(err);
    }
  })();
*/
combineFiles();