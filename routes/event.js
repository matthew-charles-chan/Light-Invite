const express = require('express');
const router  = express.Router();

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
    //add queries
    res.render(dates.ejs)
  });

  router.get('/:id/poll/:auth', (req,res) => {
    res.render('poll.ejs');

  });

  router.get('/:id/date', (req,res) => {
    res.render('meeting')
  });

  router.post('/add', (req, res) =>{
    res.redirect(`/${1}/dates`);
  });

  router.post('/users', (req, res) =>{
    res.send(req.body);
  });


  return router;
};
