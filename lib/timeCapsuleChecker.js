const cron = require("node-cron");
const db = require("./db/db");
const { getChannel } = require("./util");

let getToday = (rows) => {
    return new Promise((resolve, reject) => {
        let todayDate = rows[0].today;
        resolve(todayDate);
    });
}

// Check every six hours for time capsule messages meant for that day
let timeCapsuleCheck = async (client) => {

    // "0 21 * * *" represents running every day at exactly 9pm EST
    const update = cron.schedule("0 21 * * *", async () => {
        db.getConnection(async (err, con) => {
            let today;
            const chanID = await getChannel('general');
            const channel = client.channels.cache.get(chanID);
            
            let sql = `SELECT DATE_FORMAT(CURDATE(), '%m/%d/%Y') today`;
            let values = [];

            // Get today's date for use in comparisons
            con.query(sql, async (err, rows) => {
                today = await getToday(rows);
            });

            // Check for messages in the database that are meant to be sent today
            sql = `SELECT * FROM time_capsule`;
            con.query(sql, (err, rows) => {

                if (err) throw (err);

                rows.forEach(elem => {
                    if (elem.send_date == today) {
                        channel.send(`Time capsule messsage for **${today}** by <@${elem.user_id}> - ${elem.message}`);
                    }
                });

            });

            // Delete all messages that were sent for the day from the database to prevent sending multiple times
            // async is being stupid so we're just delaying the deletion by 1.5 seconds to be sure the previous SQL queries are complete
            setTimeout(function() {
                sql = `DELETE FROM time_capsule WHERE send_date = ?`;
                values = [today];
                con.query(sql, values);
            }, 1500);
        });
    },
    {
        scheduled: true,
        timezone: "America/New_York"
    });
    update.start();
}

module.exports = { timeCapsuleCheck }