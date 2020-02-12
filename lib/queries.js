/**
 * Get all dates for a event given event id
 * @param {String} event_id for the event
 * @return {Promise<{}>} a promise to the event dates
 */

const getDatesWithEventId = function(eventId) {
  return db.query(`SELECT start_time, end_time
  FROM dates
  WHERE event_id = $1
  order by start_time;`, [eventId])
  .then(res => {
    return res.rows[0];
  })
}


// Returns a promise to an eventId given a userId
const getEventIdWithUserId = function (userId, db) {
  return db.query(`
  SELECT events.id
  FROM events
  JOIN users on events.id = users.event_id
  WHERE users.id = $1
  `,[userId])
  .then (res => res.rows[0].id);
}

const getUserInfoWithEventId = function (eventId, db) {
  return db.query(`
  select name, email, (SELECT id from users where event_id = $1 and isCreator = true)
  FROM users
  where event_id = $1
  `, [eventId])
  .then (res => res.rows)
}

/**
 * Adds an event to the db, given a event object, user object.
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

const creatorId = function(event_id, db){
  return db.query(`SELECT id FROM users WHERE event_id = $1 AND iscreator = 't'`, [event_id])
  .then(result => result.rows[0].id)
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
  SELECT a.id as date_id, a.event_id,
  to_char(a.start_time, 'Mon DD YYYY  HH24:MI') as start_time,
  to_char(a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute', 'Mon DD YYYY  HH24:MI') as end_time,
  a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute'
  FROM dates a
  JOIN users on a.event_id = users.event_id
  WHERE users.id = $1`, [userId])
  .then(response => createDateObject(response))
  // .then(res => {
  //   return res;
  // })
}

const getStartEndWithDateId = function (dateId, db) {
  return db.query(`
  SELECT date_id,
      to_char(start_time, 'Mon DD YYYY  HH24:MI') as start_time,
      to_char(start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute', 'Mon DD YYYY  HH24:MI') as end_time,
      sum(case when isAvailable = true then 1 else 0 end) as yes_count,
      sum(case when isAvailable = false then 1 else 0 end) as no_count,
      title,
      events.description
      from votes
      JOIN dates on date_id = dates.id
      JOIN events on events.id = event_id
      where dates.id = $1
      GROUP BY date_id, dates.id, title, events.description;`, [dateId])
  .then(response => createPickedDateObject(response))
  // .then(res => {
  //   return res;
  // })
}

const createPickedDateObject = function(dateArray) {
  output= []
  dateArray.rows.forEach(el => {
    dateObject = {
      id: el.date_id,
      start_time: el.start_time,
      end_time: el.end_time,
      yes_count: el.yes_count,
      no_count: el.no_count,
      title: el.title,
      description: el.description
    }
    output.push(dateObject)
  }
)
return output[0];
}

const getVoteCount = function (userId, db) {
  return getEventIdWithUserId(userId, db)
  // .then(res => console.log(res))
  .then (res => {
    return db.query(`
    SELECT date_id,
      to_char(start_time, 'Mon DD YYYY  HH24:MI') as start_time,
      to_char(start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute', 'Mon DD YYYY  HH24:MI') as end_time,
      sum(case when isAvailable = true then 1 else 0 end) as yes_count,
      sum(case when isAvailable = false then 1 else 0 end) as no_count
      from votes
      JOIN users on user_id = users.id
      JOIN dates on date_id = dates.id
      where users.event_id = $1
      group by date_id, dates.id
    `, [res])
    .then(response => createVotesObject(response.rows))
  })
}

const checkIfVoted = function (eventId, db) {
  return db.query(`
  SELECT count(*)
  from votes
  JOIN users on user_id = users.id
  where event_id =  $1
  `, [eventId])
  .then(res => res.rows[0].count)
};

const createVotesObject = function(voteArray) {
  output = [];
  voteArray.forEach(el => {
    voteObject = {
      id: el.date_id,
      start_time: el.start_time,
      end_time: el.end_time,
      yes_count: el.yes_count,
      no_count: el.no_count
    }
    output.push(voteObject);
  })
  return output;
}

const createDateObject = function(dateArray) {
    output= []
    dateArray.rows.forEach(el => {
      dateObject = {
        id: el.date_id,
        start_time: el.start_time,
        end_time: el.end_time
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


const updateNameByUserId = function(name, id, db) {
  return db.query(`
  UPDATE users
  SET name  = $1
  WHERE id = $2
  `, [name, id])
}

const pickDate = function (eventId, db) {
  return getVoteCount(eventId, db)
  // .then(response => console.log(response))
  .then(res => {
    let voteArray = res;
    let maxYes = 0;
    let maxDifferential = 0;
    let pick;
    let pickMade = false;
    for (const vote of voteArray) {
      let noCount = vote.no_count;
      let yesCount = vote.yes_count;
      let differential = vote.yes_count - vote.no_count;

      if(noCount === 0 && yesCount > maxYes) {
        maxYes = vote.yes_count
        pick = vote.id;
        pickMade = true;
      }
      if (differential > maxDifferential) {
        maxDifferential = differential
        pick = vote.id;
        pickMade = true;

      }
    }
  if(!pickMade) {
    pick = voteArray[0].id
  }
  return pick
  })
  .then(res => getStartEndWithDateId(res, db))
}


module.exports =  { addEvent, addDate, addUserGuest, getIdFromEmail, getStartEnd, pickDate, updateNameByUserId, makeAvailable, notAvailable, DeleteVote, creatorId, getVoteCount, getEventIdWithUserId, checkIfVoted, getUserInfoWithEventId};


