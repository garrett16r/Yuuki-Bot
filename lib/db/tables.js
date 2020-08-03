const db = require("./db.js");

// Creates the 'users' and 'channels' tables if they don't already exist
function createTables()  {
    return new Promise((resolve, reject) => {
        db.getConnection((err, con) => {
            // Create users table
            con.query(
                `CREATE TABLE IF NOT EXISTS users (
                    id VARCHAR(30) NOT NULL,
                    experience INT NOT NULL DEFAULT 0,
                    level INT NOT NULL DEFAULT 0,
                    target VARCHAR(30),
                    shinies_found INT NOT NULL DEFAULT 0)`
            );
    
            // Create channels table
            con.query(
                `CREATE TABLE IF NOT EXISTS channels (
                    id VARCHAR(30) PRIMARY KEY,
                    type VARCHAR(10) UNIQUE NOT NULL)`
            );

            if (err) {
                reject(err);
            } else {
                con.release();
                resolve();
            }
        });
    })
}

module.exports = { createTables }