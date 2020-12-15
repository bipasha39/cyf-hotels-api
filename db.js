const { Pool } = require("pg");

const pool = new Pool({
  user: "",
  host: "localhost",
  database: "cyf_hotels",
  password: "",
  port: 5432,
});

module.exports = {
  pool: pool,
};
