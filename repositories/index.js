const { updateCustomer, deleteCustomer } = require("./customers.js");
const { getHotels, getHotel, createHotel } = require("./hotels.js");

module.exports = {
  updateCustomer: updateCustomer,
  deleteCustomer: deleteCustomer,
  getHotels: getHotels,
  getHotel: getHotel,
  createHotel: createHotel,
};
