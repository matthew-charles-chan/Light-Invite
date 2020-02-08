const db = require('./db');

/**
 * Get all dates for a event given event id
 * @param {String} event_id for the event
 * @return {Promise<{}>} a promise to the event dates
 */

const getDatesWithEventId = function(eventId) {
  return db.query(`SELECT id, start_time, yes_count, no_count
  FROM dates
  WHERE event_id = $1
  order by start_time;`, [eventId])
  .then(res => {
    return res.rows[0];
  })
}

/**
 * Add new event
 * @param {{title:string, description:string, duration: value}} event an object contain
 * @return {Promise<{}>} a promise to the event
 */
const addEvent = function (event) {
  return db.query(`INSERT INTO events (title, description, duration) VALUES ($1, $2, $3) RETURNING *`,
  [ event.title,
    event.description,
    event.duration
  ])
}

/**
 * Add new user
 * @param {{}} user an object containing user details
 * @return {Promise<{}>} a promise to the user
 */
const addUserCreator = function (user) {
  return db.query(`INSERT INTO users (event_id, name, email) VALUES ($1, $2, $3) RETURNING *`,
  [ user.event_id,
    user.email,
    user.email
  ])
}
