
// const addUserGuest = function (id, user, db) {
//   return db.query(`INSERT INTO users (event_id, name, email, isCreator) VALUES ($1, $2, $3, $4) RETURNING *`,
//   [ id,
//     user.name,
//     user.email
//   ])
// }


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'midterm.labber@gmail.com',
    pass: 'labber123'
  }
});


let user1 = {
  name: 'Matthew',
  email: 'm.zj.chan@gmail.com',
  id: '9de12b3b-1075-4b4b-be0e-27de280913f4'
}

const sendMail = function(user) {
  var mailOptions = {
    from: 'midterm.labber@gmail.com',
    to: user.email,
    subject: "You've been invited to an event!",
    text: `Hi ${user.name},
    You've been invited to an event! please follow this link to update your availibity
    localhost:8080/${user.id}`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { sendMail,user1 };



