const { pool } = require("../db.js");

function getHotels() {
  return pool.query("SELECT * FROM hotels;");
}

function getHotel(name) {
  return pool.query("SELECT * FROM hotels WHERE name=$1;", [name]);
}

function createHotel(name, rooms, postcode) {
  return pool.query(
    "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3);",
    [name, rooms, postcode]
  );
}

module.exports = {
  getHotels: getHotels,
  getHotel: getHotel,
  createHotel: createHotel,
};
