-- Drop and recreate events table

DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description text,
  -- duration,
  creator_id VARCHAR(255) NOT NULL
);
