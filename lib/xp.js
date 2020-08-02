/* 
* This file contains all code for the XP/leveling system.
*/
const db = require("./db/db.js");

let updateXP = (msg) => {

    if (msg.content.includes(".yu xp")) return; // Don't add xp for the .yu xp command to ensure accurate xp is displayed

    // Retrieve record for user who sent the message
    db.getConnection((err, con) => {
        con.query(`SELECT * FROM users WHERE id = '${msg.author.id}'`, (err, rows) => {
            if (err) throw err;
    
            let sql; // Variable that can be used repeatedly to hold sql code, to then insert into a query function
    
            if (rows.length < 1) {
                sql = `INSERT INTO users (id, experience) VALUES ('${msg.author.id}', 1)`
            } else {
                let xp = rows[0].experience;
                let lvl = rows[0].level;
    
                sql = `UPDATE users SET experience = ${xp + 1} WHERE id = '${msg.author.id}'`;
    
                // Check what the user's level should be based on their XP
                const currentLvl = Math.floor(0.4 * Math.sqrt(xp));
    
                // Give the user a level up if their current level doesn't match their level in the database
                if (lvl < currentLvl) {
                    sql = `UPDATE users SET level = ${lvl + 1} WHERE id = '${msg.author.id}'`;
    
                    msg.reply(`you leveled up to level ${lvl + 2}!`) // Need to add 2 to level because level 1 is really level 0 in the DB
                    .then(msg => {
                        msg.delete({ timeout: 4000 });
                    }).catch(err => {});
                }
            }
    
            con.query(sql);
            con.release();
        });
    });
}

module.exports = { updateXP };