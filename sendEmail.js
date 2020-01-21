const nodemailer = require("nodemailer");
const { emailId, emailPw } = require("./config/config");
const emailListFile = "../emailList.xlsx";
const newOrderListFile = "../newOrderList.xlsx";
const readFile = require("./function/readFile.js");


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailId,
    pass: emailPw
  }
});


let mailOptions = {
  from: emailId,
  to: "rnsdyd1022@gmail.com",
  subject: "[PURCHASE ORDER] - STLYE IN USA",
  text: "Good Morning!\n",
  html: ""
};

const emailList = readFile(emailListFile);
const newOrderList = readFile(newOrderListFile);
//console.log(emailList);
//console.log(newOrderList);
var vendorToCheck = [];
var previousVd = " ";
for (order of newOrderList) {
  let isInEmailList = false;

  let vdCode = order.STYLENUM.split("-")[0];

  for (vendor of emailList) {
    if (vendor.text == undefined) {
      vendor.text = "\n";
      vendor.html = "";
    }
    if (vendor.CODE == vdCode) {
      vendor.text =
        vendor.text +
        order.STYLENUM +
        "\t" +
        order.BOXNUM +
        "\t" +
        order.COLOR +
        "\t" +
        order.QTY +
        "\n";
      vendor.html =
        vendor.html +
        "<tr><td nowrap>" +
        order.STYLENUM +
        "</td>" +
        "<td nowrap>" +
        order.BOXNUM +
        "</td>" +
        "<td nowrap>" +
        order.COLOR +
        "</td>" +
        "<td nowrap>" +
        order.QTY +
        "</td>" +
        "</tr>";
      isInEmailList = true;
    }
  }
  if (!isInEmailList && vdCode !== previousVd) {
    vendorToCheck.push(vdCode);
  }
  previousVd = vdCode;
}
console.log(emailList);
var emailNotSent = [];
for (email of emailList) {
  let code = email.CODE;

  console.log(code);
  if (email.html.length !== 0) {
    (mailOptions.to = "rnsdyd1022@gmail.com"), (mailOptions.html =
      '<table border="1" cellspacing = "0" cellpadding= "5">' +
      email.html +
      "</table>");

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        emailNotSent.push(code);
        console.log("error Occors when sending " + code);
      } else {
        console.log("order sent to " + code + " successfully!");
      }
    });
  }
}

// for (email of emailList) {
//   console.log(email.CODE);
// }
console.log(vendorToCheck);
//mailOptions.text = mailOptions.text + "'\nYS-SD5274\t08=508\tTEAL/RUST\t6\nYS-ST1323\t08=607\tBLACK/BROWN\t12\nYS-ST1323PL PLUS\t08=607\tBLACK/BROWN\t6\nYS-SW111\t08=17\tCAMEL\t6\n'";
// mailOptions.html ="<table border=\"1\" cellspacing = \"0\" cellpadding= \"5\">" + "<tr><td nowrap>LV-CT33555A</td><td nowrap>24=302</td><td nowrap>BLACK</td><td nowrap>7</td></tr><tr><td nowrap>LV-2356412265</td><td nowrap>24=302</td><td nowrap>BLACK</td><td nowrap>7</td></tr><tr><td nowrap>Lv-231656551</td><td nowrap>24=302</td><td nowrap>red</td><td nowrap>14</td></tr>" + "</table>"
