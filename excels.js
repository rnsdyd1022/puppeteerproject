const fs = require("fs");
const Downloadsfolder = "../../Downloads/";
const xlsx = require("xlsx");

var cezanne = {
  name: "cezanne",
  startingNum: 1,
  newOrders: [],
  newOrdersDetail: [],
};
var styleinusa = {
  name: "styleinusa",
  startingNum: 301,
  newOrders: [],
  newOrdersDetail: [],
};
var btween = {
  name: "btween",
  startingNum: 501,
  newOrders: [],
  newOrdersDetail: [],
};
var appleb = {
  name: "appleb",
  startingNum: 601,
  newOrders: [],
  newOrdersDetail: [],
};
var nadia = {
  name: "nadia",
  startingNum: 801,
  newOrders: [],
  newOrdersDetail: [],
};
var laCez = {
  name: "laCez",
  startingNum: 701,
  newOrders: [],
  newOrderDetails: [],
};
var todayOrders = [];
const date = new Date().toISOString().slice(8, 10);
console.log(date);

const combineFiles = () => {
  const files = fs.readdirSync(Downloadsfolder);
  console.log(files);

  var newWB = xlsx.utils.book_new();
  for (let i = 0; i < files.length - 1; i++) {
    if (files[i][0] == "2") {
      runFashionGoorder(files[i]);
    } else if ((files[i][0] = "c")) {
      runLaShowRoomOrder(files[i]);
    }
  }
  console.log("read finish");
  var accountsOrderInfo = [cezanne, styleinusa, btween, appleb, nadia, laCez];
  for (account of accountsOrderInfo) {
    console.log(account.name);
    if (account.name !== "laCez") {
      var newOrderWS = xlsx.utils.json_to_sheet(account.newOrders);
      xlsx.utils.book_append_sheet(newWB, newOrderWS, account.name);

      var newOrderPackingWS = xlsx.utils.json_to_sheet(account.newOrdersDetail);
      let sheetName = account.name + "PackingList";
      xlsx.utils.book_append_sheet(newWB, newOrderPackingWS, sheetName);
    } else {
      var newOrderWS = xlsx.utils.json_to_sheet(account.newOrders);
      xlsx.utils.book_append_sheet(newWB, newOrderWS, account.name);
    }
  }
  var todayOrderWS = xlsx.utils.json_to_sheet(todayOrders);
  xlsx.utils.book_append_sheet(newWB, todayOrderWS, "Today Orders");
  xlsx.writeFile(newWB, "../../Downloads/Overall po info.xlsx");
};

const checkCompany = ab => {
  if (ab === "C") {
    return cezanne;
  } else if (ab === "O") {
    return styleinusa;
  } else if (ab === "H") {
    return btween;
  } else if (ab === "A") {
    return appleb;
  } else if (ab === "N") {
    return nadia;
  } else {
    return laCez;
  }
};

const runFashionGoorder = file => {
  var wb = xlsx.readFile(Downloadsfolder + file, { cellDates: true });

  var ws1 = wb.Sheets[wb.SheetNames[0]];
  var ws2 = wb.Sheets[wb.SheetNames[1]];
  var orders = xlsx.utils.sheet_to_json(ws1);
  var orderDetails = xlsx.utils.sheet_to_json(ws2);

  var targetChar = orders[0].poNumber[0];
  var company = checkCompany(targetChar);

  console.log(company.name);

  var newOrders = orders.map(record => {
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
    delete record.redeemedPoint;
    delete record.earnedPoint;
    let BoxNum = company.startingNum;

    if (BoxNum < 10) {
      BoxNum = addZeroToBoxNum(BoxNum);
    }
    console.log(BoxNum);
    record.ComfirmDate = date + "=" + BoxNum;
    company.startingNum++;
    return record;
  });

  var newOrderDetails = orderDetails.map(itemInfo => {
    for (orderInfo of newOrders) {
      if (itemInfo.orderId === orderInfo.orderId) {
        itemInfo.BoxNum = orderInfo.ComfirmDate;
      }
    }
    delete itemInfo.orderDetailId;
    delete itemInfo.orderId;
    delete itemInfo.pack;
    delete itemInfo.subTotal;
    delete itemInfo.stockAvailability;
    delete itemInfo.couponAmount;
    delete itemInfo.redeemedPoint;
    delete itemInfo.earnedPoint;
    return itemInfo;
  });

  for (order of newOrders) {
    company.newOrders.push(order);
  }

  for (order of newOrderDetails) {
    todayOrders.push(order);
    company.newOrdersDetail.push(order);
  }
};

const runLaShowRoomOrder = file => {
  var wb = xlsx.readFile(Downloadsfolder + file, { cellDates: true });

  var ws1 = wb.Sheets[wb.SheetNames[0]];
  var orders = xlsx.utils.sheet_to_json(ws1);

  var targetChar = "l";
  var company = checkCompany(targetChar);

  console.log(company.name);
  var flag = "0";
  var newOrders = orders.map(record => {
    delete record["Order Date"];
    delete record["Company Name"];
    delete record["Original Amount"];
    delete record["Sub Total"];
    delete record["Discount"];
    delete record["Shipping Cost"];
    delete record["Grand Total"];
    delete record["Order Status"];
    delete record["Status Date"];
    delete record["Card Type"];
    delete record["Payment"];
    delete record["Shipmode"];
    delete record["Phone Number"];
    delete record["Billing Address"];
    delete record["Billing City"];
    delete record["Billing State"];
    delete record["Billing Zip code"];
    delete record["Billing County"];
    delete record["Shipping Address"];
    delete record["Shipping City"];
    delete record["Shipping State"];
    delete record["Shipping Zip code"];
    delete record["Shipping Country"];
    delete record["Pack"];
    delete record["Original QTY"];
    delete record["Stock Availability"];

    console.log("flag: " + flag + "     ");
    console.log("Order number:" + record["P.O. #"] + "      ");
    if (record["P.O. #"] !== flag && flag !== "0") {
      company.startingNum++;
    }
    record.ComfirmDate = date + "=" + company.startingNum;
    console.log(company.startingNum);
    flag = record["P.O. #"];

    return record;
  });

  for (order of newOrders) {
    company.newOrders.push(order);
  }
};

const addZeroToBoxNum = startingNum => {
  return "0" + startingNum;
};

combineFiles();
