-- Drop and recreate dates table

DROP TABLE IF EXISTS dates CASCADE;
CREATE TABLE dates (
  id SERIAL PRIMARY KEY NOT NULL,
  event_id  UUID REFERENCES events(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  yes_count INTEGER DEFAULT 0,
  no_count INTEGER DEFAULT 0
);
