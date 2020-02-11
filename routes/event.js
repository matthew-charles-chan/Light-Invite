const express = require('express');
const router  = express.Router();
const { addEvent, addDate, addUserGuest, getIdFromEmail, getStartEnd, pickDate, updateNameByUserId, makeAvailable, notAvailable, DeleteVote, getVoteCount, creatorId} = require('../lib/queries.js');
const { sendMail } = require('../nodemailer/mailFunctions')

module.exports = (db) => {

  // GET Routes

  router.get('/:id/poll/', (req,res) => {
    let auth = req.params.id;
    getStartEnd(auth, db)
    .then(result => {
      console.log(result)
      let templateVars = {dates: result, user_id: auth}
      res.render('poll', templateVars);
    });
  });

  router.get('/:id/pollResult', (req, res) => {
    let user_id = req.params.id;
    // db query to get dates and vote count for each date, pass as templateVar
    getVoteCount(user_id, db)
    .then(result)
    res.render('pollResult', { user_id, dates: [{id: 1, start_time: '8:00', end_time: '9:00'}], votes: [1] });
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

  //POST Routes

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
    .then(result => {})
    .catch(err => {
      res.json({error: err.message});
    });
  });

  router.post('/users', (req, res) => {
    let event_id = req.headers.referer.slice(28, 64);
    let users = req.body;
    let emails = Object.values(users);
    emails.forEach(email => {
      addUserGuest(event_id, email, db)
      .then(results => getIdFromEmail(event_id, results.rows[0].email, db))
      .then(response => {
        let email = response.email
        let user_id = response.user_id
        sendMail(email, user_id)
      });
    });

    let creator_id;
    creatorId(event_id, db)
    .then(result => res.redirect(`/event/${result.rows[0].id}/pollResult`));
  });

  router.post('/:id/poll', (req, res) => {
    let dates = req.body;
    let { name } = req.body;
    let user_id = req.params.id;
    updateNameByUserId(name, user_id, db)
    .then(result => console.log(result));

    for(const date in dates){
      DeleteVote(date, user_id, db);
      if(dates[date] == 1){
        makeAvailable(date, user_id, db);
      }
      else if(dates[date] == 0){
        notAvailable(date, user_id, db);
      }
    }
    res.redirect(`/event/${user_id}/pollResult`);
  });


  router.get('/:userId/result', (req, res) => {
    let userId = req.params.userId
    getVoteCount(userId, db)
    .then(response => console.log(response))
  });

  // Catch All Route

  router.get('*', (req, res) => {
    res.render('index');
  });



  return router;
};


