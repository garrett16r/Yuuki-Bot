/*
This file contains any methods that are used in multiple other files.
These should generally be relatively simple utility methods that help make the code more readable and concise.
*/

const db = require("./db/db.js");

// Returns the id of the channel with the provided type
/*let getChannel = (chanType) => {
  //var chanID;

  db.getConnection((err, con) => {
    con.query(`SELECT * FROM channels WHERE type = '${chanType}'`, (err, rows) => {
      if (err) throw err;

      chanID = rows[0].id;

      // Still holds value here
      con.release();
    });
  });
  return chanID;
}*/

function getChannel (callback) {
  
}

let getDate = () => {
  const today = new Date();
  return (`${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`);
}

let getRNG = (maxRange) => {
  return Math.floor(Math.random() * maxRange);
}

module.exports = { getChannel, getDate, getRNG }
