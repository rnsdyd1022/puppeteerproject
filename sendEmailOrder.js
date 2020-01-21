const emailListFile = "../emailList.xlsx";
const newOrderListFile = "../newOrderList.xlsx";
const {
    emailId,
    emailPw
} = require("./config/config");

const readFile = require("./function/readFile.js");
const addOrderToEmailList = require("./function/addOrderToEmailList.js");
const nodemailer = require('nodemailer');

var main = () => {
    var newOrderList = readFile(newOrderListFile);
    var emailList = readFile(emailListFile);

    emailList = addOrderToEmailList(newOrderList, emailList);
    console.log(emailList);

    let mailOptions = {
        from: emailId,
        to: "rnsdyd1022@gmail.com",
        subject: "[PURCHASE ORDER] - STLYE IN USA",
        text: "Good Morning!\n",
        html: ""
    };


    send(emailList, mailOptions,(err,info)=>{
        if(err){
            console.log(err)
        }else {
            console.log("done");
        }
    });



}

var send = (list, mailOptions) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailId,
            pass: emailPw
        }
    });

    var emailNotSent = [];
    
    for(email of list) {
        setTimeout(() => {
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
        }, 5000)
    }

   
   return emailNotSent;
}

main();