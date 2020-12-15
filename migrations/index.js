const { doesNotMatch } = require("assert");
const fs = require("fs");
const { pool } = require("../db.js");

function run(number) {
  pool
    .query(fs.readFileSync("migrations/" + number + ".sql").toString())
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

function setupDB() {
  run(0);
}

module.exports = {
  run: run,
  setupDB: setupDB,
};
