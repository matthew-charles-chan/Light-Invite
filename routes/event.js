const express = require('express');
const router  = express.Router();
const { addEvent, addDate } = require('../lib/queries.js');

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
      console.log(result.rows[0]);
    })
    .catch(err => {
      res.json({error: err.message});
    });

  });


  return router;
};

