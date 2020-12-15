const { pool } = require("../db.js");

function updateCustomer(id, email) {
  return pool.query("UPDATE customers SET email=$1 WHERE id=$2;", [email, id]);
}

function deleteCustomer(id) {
  return pool.query("DELETE FROM customers WHERE id=$1;", [id]);
}

module.exports = {
  updateCustomer: updateCustomer,
  deleteCustomer: deleteCustomer,
};
