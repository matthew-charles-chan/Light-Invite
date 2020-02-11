const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'midterm.labber@gmail.com',
    pass: 'labber123'
  }
});



const sendMail = function(email, user_id) {
  var mailOptions = {
    from: 'midterm.labber@gmail.com',
    to: `${email}`,
    subject: "You've been invited to an event!",
    text: `Hi,
    You've been invited to an event! please follow this link to update your availibity
    <a href="localhost:8080/poll/${user_id}">CLICK HERE</a>`,
    html:`<b>Hi! </b><br>You've been invited to an event</br><br>Please follow this link to update your availibity!</br><br><a href="http://localhost:8080/poll/${user_id}">CLICK HERE</a></br>`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { sendMail, transporter};



