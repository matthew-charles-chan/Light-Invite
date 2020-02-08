INSERT INTO dates (event_id, start_time) VALUES ('7b9f7364-cc14-408f-b24b-cb55b6a3af4a', '07 Feb 20 16:00 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('7b9f7364-cc14-408f-b24b-cb55b6a3af4a', '08 Feb 20 18:30 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('7b9f7364-cc14-408f-b24b-cb55b6a3af4a', '08 Feb 20 16:00 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('eefb2192-5c54-425e-b5f4-e27e6df72e1e', '19 Feb 20 12:00 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('eefb2192-5c54-425e-b5f4-e27e6df72e1e', '20 Feb 20 11:00 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('eefb2192-5c54-425e-b5f4-e27e6df72e1e', '22 Feb 20 14:00 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('cbbcec37-052a-4ec2-ad55-abbbbd9e78b2', '03 Mar 20 08:00 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('cbbcec37-052a-4ec2-ad55-abbbbd9e78b2', '04 Mar 20 09:00 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('cbbcec37-052a-4ec2-ad55-abbbbd9e78b2', '05 Mar 20 14:00 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('44860379-726d-4de5-b470-571fd3eebb7d', '29 Mar 20 16:30 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('44860379-726d-4de5-b470-571fd3eebb7d', '01 Apr 20 13:45 +0000');

INSERT INTO dates (event_id, start_time) VALUES ('44860379-726d-4de5-b470-571fd3eebb7d', '03 Apr 20 13:15 +0000');


-- DROP TABLE IF EXISTS dates CASCADE;
-- CREATE TABLE dates (
--   id SERIAL PRIMARY KEY NOT NULL,
--   event_id  INTEGER REFERENCES events(id) ON DELETE CASCADE,
--   start_time TIMESTAMP NOT NULL,
--   yes_count INTEGER DEFAULT 0,
--   no_count INTEGER DEFAULT 0
-- );
