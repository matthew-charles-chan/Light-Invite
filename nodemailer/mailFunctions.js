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
    html:`<b>Hi! </b><br>You've been invited to an event</br><br>Please follow this link to update your availibity!</br><br><a href="http://localhost:8080/event/${user_id}/poll">CLICK HERE</a></br>`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const sendResultEmail = function(email, name, title, timestamp, description, user_id) {
  var mailOptions = {
    from: 'midterm.labber@gmail.com',
    to: `${email}`,
    subject: "Your Date Has Been Set!",
    html:`
    <body>
    <b>Hi, ${name}! </b>
    <br>Your date has been set!</br>
    <br><b>${title}</b></br>
    <br><b>${timestamp}</b></br>
    <br>${description}</br>
    <br>Please follow this link to see the details!</br>
    <br><a href="http://localhost:8080/event/${user_id}/close">CLICK HERE</a></br>
    </body>`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}








module.exports = { sendResultEmail, sendMail, transporter};



