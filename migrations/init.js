const fs = require("fs");
const { pool } = require("../db.js");

pool
  .query(fs.readFileSync("migrations/0_initial_snapshot.sql").toString())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
