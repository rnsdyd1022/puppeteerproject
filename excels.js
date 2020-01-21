const fs= require("fs");
const testfolder = "../../Downloads/";
const xlsx = require("xlsx");

var cezanne = {
    name: "cezanne",
    startingNum: 1,
    newOrders:[],
    newOrdersDetail:[]
};
var styleinusa = {
    name: "styleinusa",
    startingNum: 301,
    newOrders:[],
    newOrdersDetail:[]
};
var btween = {
    name: "btween",
    startingNum: 501,
    newOrders:[],
    newOrdersDetail:[]
}
var appleb = {
    name: "appleb",
    startingNum:601,
    newOrders:[],
    newOrdersDetail:[]
}
var nadia = {
    name: "nadia",
    startingNum:801,
    newOrders:[],
    newOrdersDetail:[]
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

        var ws1 = wb.Sheets[wb.SheetNames[0]];
        var ws2 = wb.Sheets[wb.SheetNames[1]];
        var orders = xlsx.utils.sheet_to_json(ws1);
        var orderDetails = xlsx.utils.sheet_to_json(ws2);

        var targetChar = orders[0].poNumber[0];
        var company = checkCompany(targetChar);
        
        console.log(company.name);

        var newOrders = orders.map((record)=> {
            delete record.discount;
            delete record.couponAmount;
            delete record.creditUsed;
            delete record.additionaldiscount;
            delete record.HandlingFee;
            delete record.shippingCharge;
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
            let BoxNum = company.startingNum;
            
            if(BoxNum < 10) {
                BoxNum = addZeroToBoxNum(BoxNum)
            }
            console.log(BoxNum);
            record.ComfirmDate = date + "=" + BoxNum;
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
            delete itemInfo.pack;
            delete itemInfo.subTotal;
            delete itemInfo.stockAvailability;
            delete itemInfo.couponAmount;
            return itemInfo;
        })

        for (order of newOrders) {
        company.newOrders.push(order);
        }

        for (order of newOrderDetails) {
            todayOrders.push(order);
            company.newOrdersDetail.push(order);
        }
        
    }
    console.log("read finish");
    var accountsOrderInfo = [cezanne,styleinusa,btween,appleb,nadia];
    for (account of accountsOrderInfo) {
        console.log(account.name);

        var newOrderWS = xlsx.utils.json_to_sheet(account.newOrders);
        xlsx.utils.book_append_sheet(newWB,newOrderWS,account.name);
        
       var newOrderPackingWS = xlsx.utils.json_to_sheet(account.newOrdersDetail);
       let sheetName = account.name + "PackingList";
       xlsx.utils.book_append_sheet(newWB,newOrderPackingWS, sheetName);
//console.log(account.name);
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

const addZeroToBoxNum = (startingNum) => {
    return ("0" + startingNum);

}
combineFiles();