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

  });

  router.get('/:id/polling', (req,res) => {

  });

  router.get('/:id/date', (req,res) => {

  });

  router.post('/add', (req, res) =>{
    res.send(req.body);
  });

  return router;
};
