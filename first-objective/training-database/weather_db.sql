-- This is a database for training a transformer model to predict el nino events
-- Table: locations

CREATE TABLE IF NOT EXISTS locations (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR( 255 ) NOT NULL,
  latitude  FLOAT NOT NULL,
  longitude FLOAT NOT NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Table: precipitations

CREATE TABLE IF NOT EXISTS precipitations (
  id          SERIAL PRIMARY KEY,
  locationId  INTEGER NOT NULL,
  date        DATE NOT NULL,
  value       FLOAT NOT NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY ( locationId ) REFERENCES locations( id )
);

-- Table: sea_surface_temperatures

CREATE TABLE IF NOT EXISTS sea_surface_temperatures (
  id          SERIAL PRIMARY KEY,
  locationId  INTEGER NOT NULL,
  date        DATE NOT NULL,
  value       FLOAT NOT NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY ( locationId ) REFERENCES locations( id )
);

-- Table: air_temperatures

CREATE TABLE IF NOT EXISTS air_temperatures (
  id          SERIAL PRIMARY KEY,
  locationId  INTEGER NOT NULL,
  date        DATE NOT NULL,
  value       FLOAT NOT NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY ( locationId ) REFERENCES locations( id )
);

-- Table: wind_speeds

CREATE TABLE IF NOT EXISTS wind_speeds (
  id          SERIAL PRIMARY KEY,
  locationId  INTEGER NOT NULL,
  date        DATE NOT NULL,
  value       FLOAT NOT NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY ( locationId ) REFERENCES locations( id )
);

-- Table: weather

CREATE TABLE IF NOT EXISTS weather (
  id                      SERIAL PRIMARY KEY,
  locationId              INTEGER NOT NULL,
  date                    DATE NOT NULL,
  precipitation           FLOAT NOT NULL,
  sea_surface_temperature FLOAT NOT NULL,
  air_temperature         FLOAT NOT NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY ( locationId ) REFERENCES locations( id )
);

-- Table: incidents

CREATE TABLE IF NOT EXISTS incidents (
  id          SERIAL PRIMARY KEY,
  locationId  INTEGER NOT NULL,
  description TEXT NOT NULL,
  type        VARCHAR( 255 ) NOT NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY ( locationId ) REFERENCES locations( id )
);

-- Triggers for updatedAt

-- CREATE OR REPLACE FUNCTION update_timestamp()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updatedAt = CURRENT_TIMESTAMP;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER update_locations
-- BEFORE UPDATE ON locations
-- FOR EACH ROW
-- EXECUTE FUNCTION update_timestamp();
--
