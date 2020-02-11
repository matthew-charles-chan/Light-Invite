const express = require('express');
const router  = express.Router();
const { addEvent, addDate, addUserGuest, getIdFromEmail } = require('../lib/queries.js');
const nodemailer = require('nodemailer');
const { sendMail, transporter } = require('../nodemailer/mailFunctions')

module.exports = (db) => {

  router.get('/:id/poll/:auth', (req,res) => {
    res.render('poll.ejs');

  });

  router.get('/:id/date', (req,res) => {
    res.render('meeting');
  });


  router.get('/:id/dates', (req, res) =>{
    // get event
    let id = req.params.id;
    db.query('SELECT * FROM events WHERE id = $1', [id])
      .then(result => {
        let event = result.rows[0];
        let templateVars = {title: event.title, duration: event.duration, id: event.id};
        return res.render('dates', templateVars);
      })
      .catch(err => {
        res.json({error: err.message});
      });
  });

  router.post('/', (req, res) =>{
    const { title, description, duration, name, email } = req.body;
    let event = {title, description, duration};
    let user = { name, email};

    return addEvent(event, user, db).then(result => {
      const id = result.rows[0].event_id;
      return res.redirect(`/event/${id}/dates`);
    });

  });

  router.post('/date', (req, res) => {
    let date = req.body.date;
    let id = req.body.id;

    addDate(id, date, db)
    .then(result => {

    })
    .catch(err => {
      res.json({error: err.message});
    });

  });

  router.post('/users', (req, res) => {
    let newid = req.headers.referer.slice(28, 64);
    let users = req.body;
    let emails = Object.values(users);
    emails.forEach(email => {
      addUserGuest(newid, email, db)
      .then(results => getIdFromEmail(newid, results.rows[0].email, db))
      .then(response => {
        let email = response.email
        let user_id = response.user_id
        console.log(email, user_id);
        sendMail(email, user_id)
      })
    });

  });


  return router;
};



// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'midterm.labber@gmail.com',
//     pass: 'labber123'
//   }
// });


// let user1 = {
//   name: 'Matthew',
//   email: 'm.zj.chan@gmail.com',
//   id: '9de12b3b-1075-4b4b-be0e-27de280913f4'
// }

// const sendMail = function(user) {
//   var mailOptions = {
//     from: 'midterm.labber@gmail.com',
//     to: user.email,
//     subject: "You've been invited to an event!",
//     text: `Hi ${user.name},
//     You've been invited to an event! please follow this link to update your availibity
//     localhost:8080/${user.id}`
//   };
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }
