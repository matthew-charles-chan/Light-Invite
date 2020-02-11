const express = require('express');
const router  = express.Router();
const { addEvent, addDate, addUserGuest, getIdFromEmail, getStartEnd } = require('../lib/queries.js');
// const nodemailer = require('nodemailer');
const { sendMail } = require('../nodemailer/mailFunctions')

module.exports = (db) => {

  router.get('/poll/:auth', (req,res) => {
    let auth = req.params.auth;
    getStartEnd(auth, db)
    .then(result => {
      let templateVars = {dates: result}
      res.render('poll', templateVars);
    });
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


