const fs= require("fs");
const testfolder = "../../Downloads/";
const xlsx = require("xlsx");

var cezanne = {
    name: "cezanne",
    startingNum: 1,
    newOrders:[]
};
var styleinusa = {
    name: "styleinusa",
    startingNum: 301,
    newOrders:[]
};
var btween = {
    name: "btween",
    startingNum: 501,
    newOrders:[]
}
var appleb = {
    name: "appleb",
    startingNum:601,
    newOrders:[]
}
var nadia = {
    name: "nadia",
    startingNum:801,
    newOrders:[]
}
var todayOrders = [];

const combineFiles = () => {
    const files = fs.readdirSync(testfolder);
    console.log(files);

    const date = new Date().toISOString().slice(8, 10);
    console.log(date);

    var newWB = xlsx.utils.book_new();
    for( let i = 0; i < files.length - 1; i++) {
        
        var wb = xlsx.readFile(testfolder + files[i], {cellDates:true});
        console.log(wb.SheetNames);

        var ws1 = wb.Sheets[wb.SheetNames[0]];
        var ws2 = wb.Sheets[wb.SheetNames[1]];
        var orders = xlsx.utils.sheet_to_json(ws1);
        var orderDetails = xlsx.utils.sheet_to_json(ws2);

        var targetChar = orders[0].poNumber[0];
        var company = checkCompany(targetChar);
        
        console.log(company.name);

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
            record.ComfirmDate = date + "=" + company.startingNum;
            company.startingNum++;
            return record;
        })

        var newOrderDetails = orderDetails.map((itemInfo)=> {
            for(orderInfo of newOrders) {
                if(itemInfo.orderId === orderInfo.orderId) {
                    itemInfo.BoxNum = orderInfo.ComfirmDate;
                }
            }
            delete itemInfo.orderDetailId;
            delete itemInfo.orderId;
            delete itemInfo.size;
            delete itemInfo.pack;
            delete itemInfo.subTotal;
            delete itemInfo.stockAvailability;
            return itemInfo;
        })

        for (order of newOrders) {
        company.newOrders.push(order);
        }

        for (order of newOrderDetails) {
            todayOrders.push(order);
        }
        
    }
    var accountsOrderInfo = [cezanne,styleinusa,btween,appleb,nadia];
    for (account of accountsOrderInfo) {
        var newWS = xlsx.utils.json_to_sheet(account.newOrders);
        xlsx.utils.book_append_sheet(newWB,newWS,account.name);
        console.log(company);
    }
    var todayOrderWS = xlsx.utils.json_to_sheet(todayOrders);
    xlsx.utils.book_append_sheet(newWB, todayOrderWS,"Today Orders");
    xlsx.writeFile(newWB,"../../Downloads/Overall po info.xlsx");
}


const checkCompany = (ab)=> {
    
    if(ab === "C") {
        return cezanne;
    } else if ( ab === "O") {
        return styleinusa;
    } else if ( ab === "H") {
        return btween;
    } else if ( ab === "A") {
        return appleb;
    } else if ( ab === "N") {
        return nadia;
    }

    return num;
}

combineFiles();