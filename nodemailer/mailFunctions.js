
const addUserGuest = function (id, user, db) {
  return db.query(`INSERT INTO users (event_id, name, email, isCreator) VALUES ($1, $2, $3, $4) RETURNING *`,
  [ id,
    user.name,
    user.email
  ])
}





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


