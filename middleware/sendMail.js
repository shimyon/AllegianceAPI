const Master = require('../models/masterModel')
const MailAddress = Master.MailAddressModal;
var nodemailer = require('nodemailer');
const fs = require('fs');


const sendMail = async(to, subject, html) => {

  const mailAddress = await MailAddress.findOne({ is_default: true });
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailAddress.Address||process.env.Email_User,
      pass: mailAddress.Password||process.env.Email_Pass
    }
  });
  let mailOptions = {
    from: mailAddress.Address||process.env.Email_User,
    to: to,
    subject: subject,
    html: html
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.status(400).json({
        success: false,
        msg: "Error in sending mail. " + info.response,
        data: null,
      });
    }
  });
}
const sendpdfMail = async(to, subject, html) => {

  const mailAddress = await MailAddress.findOne({ is_default: true });
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailAddress.Address||process.env.Email_User,
      pass: mailAddress.Password||process.env.Email_Pass
    }
  });
  const attachmentPath = '/path/to/your/pdf/file.pdf';
const attachment = fs.readFileSync(attachmentPath);

  let mailOptions = {
    from: mailAddress.Address||process.env.Email_User,
    to: to,
    subject: subject,
    html: html,
    attachments: [
      {
        filename: 'file.pdf',
        content: attachment,
      },
    ],
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.status(400).json({
        success: false,
        msg: "Error in sending mail. " + info.response,
        data: null,
      });
    }
  });
}
module.exports = {
  sendMail,
  sendpdfMail
}