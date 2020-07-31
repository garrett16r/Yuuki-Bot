const { Command } = require('discord.js-commando');
const { Client, MessageEmbed } = require('discord.js');
const mysql = require("mysql");

// MySQL Setup
var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.DATABASE
  });

module.exports = class XPCommand extends Command {
  constructor (client) {
    super (client, {
      name: "xp",
      group: "game",
      memberName: "xp",
      description: "Displays the XP of the given user",
      details: "",
      args: [
        {
          key: "user",
          prompt: "Which user's XP would you like to check? (Use their @, leave blank to check your own XP)",
          type: "user",
        }
      ],
      examples: [".yu xp <@user>", ".yu xp"]
    })
  };

  async run(msg, { user }) {
    
    if (user.bot) return msg.reply("can't check the XP of a bot!");

    var user_id = user.id;

    con.query(`SELECT * FROM users WHERE id = '${user_id}'`, (err, rows) => {
        if (err) throw err;

        if (rows.length < 1) {
            msg.reply("that user hasn't sent any messages yet!");
        } else {
            let xp = rows[0].experience;
            let lvl = rows[0].level;
            var a = (lvl + 1) / 0.4;
            var lvlThreshold = Math.pow(a, 2);
            var remaining;

            if ((lvl % 2) == 0) {
                remaining = (Math.ceil(lvlThreshold) - xp) + 1;
            } else {
                remaining = (lvlThreshold - xp) + 1;
            }

            const embedDesc = 
            `XP: ${xp}\n
            Level: ${lvl + 1}\n
            XP to Next Level: ${remaining}`;

            const embed = new MessageEmbed()
            .setTitle(`@${user.tag}'s XP`)
            .setColor(0x7900a8)
            .setDescription(embedDesc);

            msg.channel.send(embed)
            .catch(err => {
                console.log(err);
            });
        }
    });
  }
}
