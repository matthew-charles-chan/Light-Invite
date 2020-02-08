const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'midterm.labber@gmail.com',
    pass: 'labber123'
  }
});

var mailOptions = {
  from: 'midterm.labber@gmail.com',
  to: 'midterm.labber@gmail.com',
  subject: 'THIS IS A TEST',
  text: 'this is a test to see if i can send mail from a different file'
};


const sendMail = function() {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendMail
