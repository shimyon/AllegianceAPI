var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kshitij00740@gmail.com',
    pass: 'mfwexfybankphdye'
  }
});


let sendMail=(to, subject, html)=>{
    
    let mailOptions = {
        from: 'sunil00740@gmail.com',
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