const Master = require('../models/masterModel')
const MailAddress = Master.MailAddressModal;
var nodemailer = require('nodemailer');


const sendMail = async(to, subject, html) => {

  const mailAddress = await MailAddress.findOne({ is_default: true });
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailAddress.Address,
      pass: mailAddress.Password
    }
  });
  let mailOptions = {
    from: mailAddress.Address,
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
  sendMail
}