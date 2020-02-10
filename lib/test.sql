select a.id, a.event_id, a.start_time,
  a.start_time + (select duration from events where events.id = a.event_id) * Interval '1 minute'
  as end_time
  from dates a
  where event_id = '7b9f7364-cc14-408f-b24b-cb55b6a3af4a';




-- select * from users

--     FROM dates
--   JOIN events on events.id = event_id
--   ORDER BY event_id, dates.id;


-- select a.start_time + 20 from dates a


-- datetime + variable * INTERVAL '1 day'
