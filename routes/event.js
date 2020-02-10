const express = require('express');
const router  = express.Router();

const path = require('path');
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

  router.get('/:id/poll/:auth', (req,res) => {
    res.render('poll.ejs');

  });

  router.get('/:id/date', (req,res) => {
    res.render('meeting')
  });


  router.get('/:id/dates', (req, res) =>{
    // get event
    let id = req.params.id;
    db.query('SELECT * FROM events WHERE id = $1', [id])
    .then(result => {
      let event = result.rows[0];
      let templateVars = {title: event.title, duration: event.duration};
      return res.render('dates', templateVars);
    })

    // setup template vars

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

  router.post('/users', (req, res) =>{
    //add users to database
    //Send creator to poll page??
    //res.redirect('poll');
    res.send(req.body);
  });

  return router;
};

