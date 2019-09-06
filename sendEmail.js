const nodemailer = require("nodemailer");
const { emailId, emailPw } = require("./config/config");

console.log(emailId + emailPw);
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
  subject: "test",
  text: "test test"
};

transporter.sendMail(mailOptions, function(err, data) {
  if (err) {
    console.log("error Occors", err);
  } else {
    console.log("mail send successful");
  }
});
