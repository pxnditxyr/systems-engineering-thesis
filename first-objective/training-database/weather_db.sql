-- This is a database for training a transformer model to predict el nino events

CREATE DATABASE IF NOT EXISTS weather_db;

-- Table: locations

CREATE TABLE IF NOT EXISTS locations (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR( 255 ) NOT NULL,
  latitude  FLOAT NOT NULL,
  longitude FLOAT NOT NULL,

  createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: precipitations

CREATE TABLE IF NOT EXISTS precipitations (
  id          SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL,
  date        DATE NOT NULL,
  value       FLOAT NOT NULL,

  createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ( location_id ) REFERENCES locations( id )
);

-- Table: sea_surface_temperatures

CREATE TABLE IF NOT EXISTS sea_surface_temperatures (
  id          SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL,
  date        DATE NOT NULL,
  value       FLOAT NOT NULL,

  createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ( location_id ) REFERENCES locations( id )
);

-- Table: air_temperatures

CREATE TABLE IF NOT EXISTS air_temperatures (
  id          SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL,
  date        DATE NOT NULL,
  value       FLOAT NOT NULL,

  createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ( location_id ) REFERENCES locations( id )
);

-- Table: wind_speeds

CREATE TABLE IF NOT EXISTS wind_speeds (
  id          SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL,
  date        DATE NOT NULL,
  value       FLOAT NOT NULL,

  createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ( location_id ) REFERENCES locations( id )
);

-- Table: weather

CREATE TABLE IF NOT EXISTS weather (
  id                      SERIAL PRIMARY KEY,
  location_id             INTEGER NOT NULL,
  date                    DATE NOT NULL,
  precipitation           FLOAT NOT NULL,
  sea_surface_temperature FLOAT NOT NULL,
  air_temperature         FLOAT NOT NULL,

  createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ( location_id ) REFERENCES locations( id )
);

-- Table: incidents

CREATE TABLE IF NOT EXISTS incidents (
  id          SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  type        VARCHAR( 255 ) NOT NULL,

  createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ( location_id ) REFERENCES locations( id )
);
