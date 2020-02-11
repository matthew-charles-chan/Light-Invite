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

const getEventIdWithUserId = function (userId, db) {
  return db.query(`
  SELECT events.id
  FROM events
  JOIN users on events.id = users.event_id
  WHERE users.id = $1
  `,[userId])
  .then (res => res.rows[0].id);
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

const getStartEndWithDateId = function (userId, db) {
  return db.query(`
  SELECT a.id as date_id, a.event_id, a.start_time,
  a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute'
  as end_time
  FROM dates a
  WHERE id = $1`, [userId])
  .then(response => createDateObject(response))
  // .then(res => {
  //   return res;
  // })
}

const getVoteCount = function (userId, db) {
  return getEventIdWithUserId(userId, db)
  // .then(res => console.log(res))
  .then (res => {
    return db.query(`
    SELECT date_id,
      start_time,
      start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute' as end_time,
      sum(case when isAvailable = true then 1 else 0 end) as yes_count,
      sum(case when isAvailable = false then 1 else 0 end) as no_count
      from votes
      JOIN users on user_id = users.id
      JOIN dates on date_id = dates.id
      where users.event_id = $1
      group by date_id, dates.id
    `, [res])
    .then(response => response.rows)
  })
}

const createVotesObject = function(voteArray) {
  output = [];

}

const createDateObject = function(dateArray) {
    output= []
    dateArray.rows.forEach(el => {
      let start = String(el.start_time).split('G');
      let end = String(el.end_time).split('G');
      dateObject = {
        id: el.date_id,
        start_time: start[0],
        end_time: end[0]
      }
      output.push(dateObject)
    }
  )
  return output;
  }

// Increment yes_count
const DeleteVote = function(dateId, userId, db) {
  return db.query(`
  DELETE FROM votes
    WHERE date_id = $1
    AND user_id = $2
  `, [dateId, userId])
}

const makeAvailable = function (dateId, userId, db) {
  return db.query(`
  INSERT INTO votes (date_id, user_id, isAvailable)
  VALUES ($1, $2, $3)
  `, [dateId, userId, true])
}
const notAvailable = function (dateId, userId, db) {
  return db.query(`

  INSERT INTO votes (date_id, user_id)
  VALUES ($1, $2)
  `, [dateId, userId])
}



// GET yes, no count all events with given id


const getYesNoCount = function (dateId, db) {
  return db.query(`
  SELECT id, yes_count, no_count
  FROM dates
  WHERE id = $1
  `, [eventId])
  .then (res => createVoteArray(res.rows))
}

const createVoteArray = function(votes) {
  let voteObject = {};
  votes.forEach(date => {
     voteObject[date.id] = {
      yes_count: date.yes_count,
      no_count: date.no_count
    }
  })
  return voteObject;
}

const updateNameByUserId = function(name, id, db) {
  return db.query(`
  UPDATE users
  SET name  = $1
  WHERE id = $2
  `, [name, id])
}

const pickDate = function (eventId, db) {
  getYesNoCount(eventId, db)
  .then(res => {
    let voteObject = res;
    let maxYes = 0;
    let maxDifferential = 0;
    let pick;
    for (const vote in voteObject) {
      let noCount = voteObject[vote].no_count;
      let yesCount = voteObject[vote].yes_count;
      let differential = yesCount - noCount;
      if(noCount === 0 && yesCount > maxYes) {
        maxYes = voteObject[vote].yes_count
        pick = vote;
      }
      if (differential > maxDifferential) {
        maxDifferential = differential
        pick = vote;
      }
    }
    getStartEndWithDateId(pick, db)
    .then(res =>  console.log(res))
  })
}


// const createDateObject = function(dateArray) {
//   output= []
//   dateArray.rows.forEach(el => {
//     let start = String(el.start_time).split('G');
//     let end = String(el.end_time).split('G');
//     dateObject = {
//       id: el.date_id,
//       start_time: start[0],
//       end_time: end[0]
//     }
//     output.push(dateObject)
//   }
// )
// return output;
// }

module.exports =  { addEvent, addDate, addUserGuest, getIdFromEmail, getStartEnd, pickDate, updateNameByUserId, makeAvailable, notAvailable, DeleteVote, getVoteCount};

