/* 
* This file contains all code for the XP/leveling system.
*/

let updateXP = (msg, con) => {

    // Retrieve record for user who sent the message
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

                msg.reply(`you leveled up to level ${lvl + 1}!`)
                .then(msg => {
                    msg.delete({ timeout: 4000 });
                }).catch(err => {});
            }
        }

        con.query(sql);
    });
}

module.exports = { updateXP }