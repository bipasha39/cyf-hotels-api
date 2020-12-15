DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(30) NOT NULL,
  email    VARCHAR(120) NOT NULL,
  address  VARCHAR(120),
  city     VARCHAR(30),
  postcode VARCHAR(12),
  country  VARCHAR(20)
);

CREATE TABLE hotels (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(120) NOT NULL,
  rooms    INT NOT NULL,
  postcode VARCHAR(10)
);

CREATE TABLE bookings (
  id            SERIAL PRIMARY KEY,
  customer_id   INT REFERENCES customers(id) ON DELETE SET NULL,
  hotel_id      INT REFERENCES hotels(id) ON DELETE SET NULL,
  checkin_date  DATE NOT NULL,
  nights        INT NOT NULL
);
