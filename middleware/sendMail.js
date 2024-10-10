// const Master = require('../models/masterModel')
// const MailAddress = Master.MailAddressModal;
const SassMaster = require('../models/saasmasterModel');
const MailAddresss = SassMaster.MailAddressModal;
const fs = require('fs');
var nodemailer = require('nodemailer');


const sendMail = async(to, subject, html, req) => {
  // let MailAddress = MailAddresss(req.conn);
  // const mailAddress = await MailAddress.findOne({ is_default: true });
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // user: mailAddress.Address||process.env.Email_User,
      // pass: mailAddress.Password||process.env.Email_Pass
      user: process.env.Email_User,
      pass: process.env.Email_Pass
    }
  });
  let mailOptions = {
    // from: mailAddress.Address||process.env.Email_User,
    from: process.env.Email_User,
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

module.exports = {
  sendMail,
}