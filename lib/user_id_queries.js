const getEventIdWithUserId = function (userId, db) {
  return db.query(`
  SELECT events.id
  FROM events
  JOIN users on events.id = users.event_id
  WHERE users.id = $1
  `,[userId])
  .then (res => res.rows[0].id);
}


module.exports = {
  getEventIdWithUserId
}
