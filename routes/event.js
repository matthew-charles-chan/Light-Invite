const express = require('express');
const router  = express.Router();
const addEvent = require('../lib/queries.js')

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get('/:id/dates', (req,res) => {
    //is passeed event_id
    //add creator dates to db queries
    //get event title and display!
    let templateVars = {};
    res.render('dates');
  });

  router.get('/:id/poll/:auth', (req,res) => {
    res.render('poll.ejs');

  });

  router.get('/:id/date', (req,res) => {
    res.render('meeting')
  });

  router.post('/add', (req, res) =>{
    //add event to database
    //retrive event_id from database and redirct with that id
    const { title, description, duration, name, email } = req.body;
    let event = {title, description, duration};
    let user = { name, email};
    addEvent(event, user, db)
    .then(res => res.rows[0].event_id)
    .then(result => res.redirect(`/${result}/dates`));
    //res.redirect(`/${event_id}/dates`);
  });

  router.post('/users', (req, res) =>{
    //add users to database
    //Send creator to poll page??
    //res.redirect('poll');
    res.send(req.body);
  });


  return router;
};
