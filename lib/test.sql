SELECT dates.id,
      to_char(start_time, 'Mon DD YYYY  HH24:MI') as start_time,
      to_char(start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute', 'HH24:MI') as end_time,
      0 as yes_count,
      0 as no_count,
      title,
      events.description
      from dates
      JOIN events on events.id = event_id
      where dates.id = 73
      GROUP BY dates.id, title, events.description;


--  SELECT date_id,
--       to_char(start_time, 'Mon DD YYYY  HH24:MI') as start_time,
--       to_char(start_time + (select duration from events where events.id = dates.event_id) * Interval '1 minute', 'HH24:MI') as end_time,
--       sum(case when isAvailable = true then 1 else 0 end) as yes_count,
--       sum(case when isAvailable = false then 1 else 0 end) as no_count,
--       title,
--       events.description
--       from votes
--       JOIN dates on date_id = dates.id
--       JOIN events on events.id = event_id
--       where dates.id = 13
--       GROUP BY date_id, dates.id, title, events.description;
