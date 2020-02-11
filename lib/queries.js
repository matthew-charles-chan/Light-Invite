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
const addEvent = function (event, user, db) {
  return db.query(`INSERT INTO events (title, description, duration) VALUES ($1, $2, $3) RETURNING *`,
  [ event.title,
    event.description,
    event.duration
  ])
    .then(res => {
      return res.rows[0].id
    })
    .then(res => addUserCreator(res, user, db))
}


/**
 * Add new user, Creator
 * @param {{event.id: string}{user: object}{db}}
 * @return {Promise<{}>} a promise to the user, sets isCreator to true
 */
const addUserCreator = function (id, user, db) {

  return db.query(`INSERT INTO users (event_id, name, email, isCreator) VALUES ($1, $2, $3, $4) RETURNING *`,
  [ id,
    user.name,
    user.email,
    true
  ])
}

/**
 * Add new user, Guest
 * @param {{}} user an object containing user details
 * @return {Promise<{}>} a promise to the user, default isCreator to false
 */
const addUserGuest = function (id, email, db) {
  return db.query(`INSERT INTO users (event_id, email) VALUES ($1, $2) RETURNING *`,
  [ id,
    email
  ])
}


const getIdFromEmail = function (event_id, email, db) {
  return db.query(`SELECT id as user_id, email FROM users where event_id = $1 AND email = $2`, [event_id, email])
  .then(res => res.rows[0])
}


/**
 * Add new date
 * @param {{}} date an objdateect containing date details (event id, start_time)
 * @return {Promise<{}>} a promise to the new date
 */

//  const addDate = function (eventId, date, db) {
//    return db.query(`INSERT INTO dates (event_id, start_time) VALUES ($1, $2) RETURNING *`, [eventId, date])
//  }

const addDate = function (eventId, date, db) {
  return db.query(`INSERT INTO dates (event_id, start_time) VALUES ($1, $2) RETURNING *`, [eventId, date])
}



// GET user data from users, given event_id
const getEmailsUserId = function (eventId, db) {
 return db.query(`SELECT name, email, id from users where event_id = ${eventId} RETURNING *`)
}


//GET start and end time given event_id and duration
const getStartEnd = function (userId, db) {
  return db.query(`
  SELECT a.id as date_id, a.event_id, a.start_time,
  a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute'
  as end_time
  FROM dates a
  JOIN users on a.event_id = users.event_id
  WHERE users.id = $1`, [userId])
  .then(response => createDateObject(response))
  // .then(res => {
  //   return res;
  // })
}

const createDateObject = function(dateArray) {
    output= []
    dateArray.rows.forEach(el => {
      dateObject = {
        id: el.date_id,
        start_time: el.start_time,
        end_time: el.end_time
      }
    }
  )
  return dateObject;
  }

// Increment yes_count

const incrementYes = function (id, db) {
  return db.query(`
  UPDATE dates
  SET yes_count = yes_count + 1
  WHERE id = $1
  `, [id])
}



// Increment no_count
const incrementNo = function (id, db) {
  return db.query(`
  UPDATE dates
  SET no_count = no_count + 1
  WHERE id = $1
  `, [id])
}


// GET yes, no count all events with given id


const GetYesNoCount = function (id, db) {
  return db.query(`
  SELECT id, yes_count, no_count
  FROM dates
  WHERE event_id = $1
  `, [id])
  .then (res => res.rows[0])
}

module.exports =  { addEvent, addDate, addUserGuest, getIdFromEmail, getStartEnd };
