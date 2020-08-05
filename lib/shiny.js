/**
 * This file handles all shiny message checks
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
                sql = 'UPDATE users SET target = ? WHERE id = ?';
                values = [target, msg.author.id];
            }

            con.query(sql, values);

            if (err) {
                reject(err);
            } else {
                con.release();
                resolve();
            }
        })
    })
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

let sendShinyAlert = (msg, target, odds) => {
    const embed = new MessageEmbed()
    .setColor(0x7900a8)
    .setTitle(`***Shiny ${target} Found!***`)
    .setDescription(`Congrats! You found a shiny **${target}** with odds of **${odds}**!\nMake sure to set a new target with '.yu target <target>'!`)
    .attachFiles(['./res/salandit.gif'])
    .setImage("attachment://salandit.gif")
    .setFooter("Use \'.yu shinies <@user>\' to view all shinies found by a user.");

    msg.channel.send(embed);
}

async function checkIfShiny(msg) {
    try {
        const target = await getUserTarget(msg);

        if (!target) return;

        if (getRNG(2048) == 42) {
            console.log("----------------------\nSHINY MESSAGE\n----------------------");
            sendShinyAlert(msg, target, "1/2048");
            updateShinies(msg, target, "1/2048");
            await updateUserTarget(msg, "null");
        }
        
        if (getRNG(4096) == 42) {
            console.log("----------------------\nSHINY MESSAGE\n----------------------");
            sendShinyAlert(msg, target, "1/4096");
            updateShinies(msg, target, "1/4096");
            await updateUserTarget(msg, "null");
        }

        if (getRNG(8192) == 42) {
            console.log("----------------------\nSHINY MESSAGE\n----------------------");
            sendShinyAlert(msg, target, "1/8192");
            updateShinies(msg, target, "1/8192");
            await updateUserTarget(msg, "null");
        }
        
        if (getRNG(100000) == 42) {
            console.log("----------------------\nSHINY MESSAGE\n----------------------");
            sendShinyAlert(msg, target, "1/100,000");
            updateShinies(msg, target, "1/100,000");
            await updateUserTarget(msg, "null");
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getUserTarget, getFormattedDateFound, updateUserTarget, checkIfShiny }