/**
 * This file handles all shiny message checks and responses
 */

const { Client, MessageEmbed } = require('discord.js');
const { getRNG } = require("./util.js");
const db = require("./db/db.js");

let getUserTarget = (msg) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, con) => {

            let sql = 'SELECT * FROM users WHERE id = ?'
            let values = [msg.author.id];
    
            con.query(sql, values, (err, rows) => {
                if (err) throw err;
    
                let target = rows[0].target;

                if (err) {
                    reject(err);
                } else {
                    con.release();
                    resolve(target);
                }
            });
        })
    })
}

let updateUserTarget = (msg, target) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, con) => {

            let sql;
            let values;

            if (target == "null") {
                sql = 'UPDATE users SET target = null WHERE id = ?';
                values = [msg.author.id];
            } else {

                sql = 'SELECT * FROM pokemon WHERE name = ?';
                values = [target];

                con.query(sql, values, (err, rows) => {
                    if (err) throw err;

                    // Only allow setting a valid Pokemon as a target
                    if (rows.length < 1) {
                        con.release();
                        resolve();
                    } else {
                        sql = 'UPDATE users SET target = ? WHERE id = ?';
                        values = [target, msg.author.id];

                        con.query(sql, values);
                        con.release();
                        resolve();
                    }
                });
            }
        });
    });
}

let updateShinies = (msg, target, odds) => {
    db.getConnection((err, con) => {

        let sql = 'SELECT * FROM users WHERE id = ?';
        let values = [msg.author.id];

        con.query(sql, values, (err, rows) => {
            if (err) throw err;

            let found = rows[0].shinies_found;

            sql = 'UPDATE users SET shinies_found = ? WHERE id = ?';
            values = [found + 1, msg.author.id];

            con.query(sql, values); // Update number of shinies found for the user
        });

        sql = `INSERT INTO shinies (name, owner_id, odds, date_found) VALUES (?, ?, ?, CURDATE())`;
        values = [target, msg.author.id, odds];

        con.query(sql, values); // Add a new record for a found shiny 
        con.release();
    })
}

let getFormattedDateFound = (user, name) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, con) => {
            
            let sql = (
                `SELECT DATE_FORMAT(date_found, '%m/%d/%Y') found FROM shinies 
                WHERE owner_id = ? AND name = ?`
            );
            let values = [user.id, name];
            
            con.query(sql, values, (err, rows) => {
                if (err) throw err;

                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0].found);
                }
            });
        });
    });
}

let getShinySprite = (msg, target) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, con) => {

            let sql = 'SELECT * FROM pokemon WHERE name = ?';
            let values = [target];
    
            con.query(sql, values, (err, rows) => {
                if (err) throw err;

                if (rows.length < 1) {
                    return msg.reply(`${target} is not a valid Pokemon!`);
                }

                const sprite = rows[0].sprite;

                if (err) {
                    reject(err);
                } else {
                    con.release();
                    resolve(sprite);
                }
            });
    
        });
    });
}

let getOdds = (target) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, con) => {

            let sql = 'SELECT * FROM pokemon WHERE name = ?';
            let values = [target];

            con.query(sql, values, (err, rows) => {

                let odds = rows[0].odds;

                if (err) {
                    reject(err);
                } else {
                    con.release();
                    resolve(odds);
                }

            })

        })
    })
}

let sendShinyAlert = async (msg, target, odds) => {
    const sprite = await getShinySprite(msg, target);
    const embed = new MessageEmbed()
    .setColor(0x7900a8)
    .setTitle(`***Shiny ${target} Found!***`)
    //.setDescription(`Congrats! You found a shiny **${target}** with odds of **${odds}**!\n`)
    .addFields(
        {name: 'Congrats!', value: `You found a shiny **${target}** with odds of **${odds}**!\n`, inline: true}
    )
    .attachFiles([{ name: 'sprite.gif', attachment: `./res/sprites/${sprite}` }])
    .setImage(`attachment://sprite.gif`)
    .setFooter("Your target has been reset, make sure to set a new one with '.yu target'!\nUse \'.yu shinies <@user>\' to view all shinies found by a user.");

    msg.channel.send(embed);
}

let checkIfShiny = async (msg) => {
    try {
        const target = await getUserTarget(msg);
        let odds;

        if (!target) {
            return;
        } else {
            odds = await getOdds(target);
        }

        let rng = getRNG(odds);
        let rarerRng = getRNG(100000);

        if (rng == 42) {
            console.log("----------------------\nSHINY MESSAGE\n----------------------");
            sendShinyAlert(msg, target, `1/${odds}`);
            updateShinies(msg, target, `1/${odds}`);
            await updateUserTarget(msg, "null");
        }
        
        if (rarerRng == 42) {
            console.log("----------------------\nSHINY MESSAGE\n----------------------");
            sendShinyAlert(msg, target, "1/100,000");
            updateShinies(msg, target, "1/100,000");
            await updateUserTarget(msg, "null");
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getUserTarget, getFormattedDateFound, updateUserTarget, checkIfShiny, getShinySprite, getOdds }