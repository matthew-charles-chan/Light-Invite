-- select a.id, a.event_id, a.start_time,
--   a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute'
--   as end_time
--   from dates a
--   where event_id = '7b9f7364-cc14-408f-b24b-cb55b6a3af4a';





--     FROM dates
--   JOIN events on events.id = event_id
--   ORDER BY event_id, dates.id;


-- select a.start_time + 20 from dates a


-- datetime + variable * INTERVAL '1 day'


-- SELECT users.id FROM users where event_id =  '7b9f7364-cc14-408f-b24b-cb55b6a3af4a' AND email = 'm.zj.chan@gmail.com';


-- fa5597c2-1980-4d00-8312-0b4184a6f4e5


-- SELECT a.id as date_id, a.event_id, a.start_time,
--   a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute'
--   as end_time
--   FROM dates a
--   JOIN users on a.event_id = users.event_id
--   WHERE users.id = '410e6bda-686c-4902-be8c-6a66101c2804';



-- DELETE FROM votes
--   WHERE date_id = 1
--   AND user_id = '6ae6ae66-6edf-4467-b764-93865c53e32e';

-- INSERT INTO votes (date_id, user_id)
--   VALUES (1, '6ae6ae66-6edf-4467-b764-93865c53e32e');

-- SELECT date_id,
--     start_time,
--     start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute' as end_time,
--     sum(case when isAvailable = true then 1 else 0 end) as yes_count,
--     sum(case when isAvailable = false then 1 else 0 end) as no_count
--   from votes
--   JOIN users on user_id = users.id
--   JOIN dates on date_id = dates.id
--   where users.event_id = 'a6e2fce2-abae-4e63-9a29-5ca2c78a9ffd'
-- group by date_id, dates.id;


-- SELECT date_id,
--     to_char(start_time, 'Mon DD YYYY  HH24:MI') as start_time,
--     to_char(start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute', 'Mon DD YYYY  HH24:MI') as end_time,
--     sum(case when isAvailable = true then 1 else 0 end) as yes_count,
--     sum(case when isAvailable = false then 1 else 0 end) as no_count
--   from votes
--   JOIN users on user_id = users.id
--   JOIN dates on date_id = dates.id
--   where users.event_id = 'a6e2fce2-abae-4e63-9a29-5ca2c78a9ffd'
-- group by date_id, dates.id;



-- SELECT date_id,
--       to_char(start_time, 'Mon DD YYYY  HH24:MI') as start_time,
--       to_char(start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute', 'Mon DD YYYY  HH24:MI') as end_time,
--       sum(case when isAvailable = true then 1 else 0 end) as yes_count,
--       sum(case when isAvailable = false then 1 else 0 end) as no_count
--       from votes
--       JOIN dates on date_id = dates.id
--       where dates.id = 14
--       GROUP BY date_id, dates.id;
--       -- group by date_id, dates.id



--  SELECT events.id
--   FROM events
--   JOIN users on events.id = users.event_id
--   WHERE users.id = '5a5dd1d0-64d7-4670-9626-e04aef5baece';

-- SELECT a.id as date_id, a.event_id,
--   to_char(a.start_time, 'Mon DD YYYY  HH24:MI') as start_time,
--   to_char(a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute', 'Mon DD YYYY  HH24:MI') as end_time,
--   a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute'
--   FROM dates a
--   JOIN users on a.event_id = users.event_id
--   WHERE users.id = '5a5dd1d0-64d7-4670-9626-e04aef5baece';


-- SELECT count(*)
-- from votes
-- JOIN users on user_id = users.id
-- where event_id =  'a6e2fce2-abae-4e63-9a29-5ca2c78a9ffd';

-- SELECT date_id,
--       to_char(start_time, 'Mon DD YYYY  HH24:MI') as start_time,
--       to_char(start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute', 'Mon DD YYYY  HH24:MI') as end_time,
--       sum(case when isAvailable = true then 1 else 0 end) as yes_count,
--       sum(case when isAvailable = false then 1 else 0 end) as no_count,
--       title,
--       events.description
--       from votes
--       JOIN dates on date_id = dates.id
--       JOIN events on events.id = event_id
--       where dates.id = 14
--       GROUP BY date_id, dates.id, title, events.description;


select event_id from users where id = 9551c619-c666-4b91-ba4d-e621dbeace89

select name, email, (SELECT id from users where event_id = 'a6e2fce2-abae-4e63-9a29-5ca2c78a9ffd' and isCreator = true)
FROM users
where event_id = 'a6e2fce2-abae-4e63-9a29-5ca2c78a9ffd'
;
