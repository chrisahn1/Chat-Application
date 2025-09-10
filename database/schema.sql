set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table if not exists "users" (
  ID SERIAL NOT NULL PRIMARY KEY,
  profilepic BYTEA,
  username VARCHAR(255),
  email VARCHAR(255),
  hashpassword VARCHAR(255)
  );

create table if not exists "channels" (
  ID SERIAL NOT NULL PRIMARY KEY,
  channelpic BYTEA,
  channelname TEXT,
  host TEXT[],
  messages JSONB
  );

create table if not exists "users_channels" (
  users_id INT,
  channels_id INT,
  PRIMARY KEY (users_id, channels_id),
  CONSTRAINT fk_users FOREIGN KEY(users_id) REFERENCES users(ID),
  CONSTRAINT fk_channels FOREIGN KEY(channels_id) REFERENCES channels(ID)
  );
