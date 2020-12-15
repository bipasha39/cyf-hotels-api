const { doesNotMatch } = require("assert");
const fs = require("fs");
const { pool } = require("../db.js");

pool
  .query(fs.readFileSync("migrations/initial_snapshot.sql").toString())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
