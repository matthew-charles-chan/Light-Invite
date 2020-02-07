

-- Drop and recreate user table

DROP TABLE IF EXISTS users CASCADE;
CREATE EXTENSION pgcrypto;
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id  INTEGER REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);
