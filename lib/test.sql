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



DELETE FROM votes
  WHERE date_id = 1
  AND user_id = '6ae6ae66-6edf-4467-b764-93865c53e32e';

INSERT INTO votes (date_id, user_id)
  VALUES (1, '6ae6ae66-6edf-4467-b764-93865c53e32e');
