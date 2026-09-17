-- Runs once, when the Postgres volume is first created.
--
-- Payload owns `cms`, Prisma owns `app`. Creating both up front means neither
-- migration runner has to hold CREATE SCHEMA rights at deploy time.
CREATE SCHEMA IF NOT EXISTS cms;
CREATE SCHEMA IF NOT EXISTS app;
