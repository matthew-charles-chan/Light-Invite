-- Drop and recreate events table
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description text,
  duration integer NOT NULL
);
