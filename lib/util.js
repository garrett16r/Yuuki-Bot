/*
This file contains any methods that are used in multiple other files.
These should generally be relatively simple utility methods that help make the code more readable and concise.
*/
const db = require("./db/db.js");
const mysql = require("mysql");

function getChannel(chanType, callback) {
  db.getConnection((err, con) => {
    let sql = 'SELECT * FROM channels WHERE type = ?';
    let values = [chanType];
    con.query(sql, values, (err, rows) => {
      if (err) throw err;

      if (rows.length < 1 && chanType == "commands") {
        return console.log("Commands channel not yet assigned; make sure to use \'.yu setchan <#channel> commands\' to establish command inhibitor!");
      }

      const chanID = rows[0].id;
      con.release();
      
      callback(chanID);
    });
  });
}

let getRNG = (maxRange) => {
  return Math.floor(Math.random() * maxRange);
}

module.exports = { getChannel, getRNG }
