var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.Email_User,
    pass: process.env.Email_Pass
  }
});


let sendMail=(to, subject, html)=>{
    
    let mailOptions = {
        from: process.env.Email_User,
        to: to,
        subject: subject,
        html: html
  };
    transporter.sendMail(mailOptions, function(error, info){
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