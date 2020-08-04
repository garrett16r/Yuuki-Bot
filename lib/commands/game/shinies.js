const { Command } = require('discord.js-commando');
const { Client, MessageEmbed } = require('discord.js');
const db = require("../../db/db.js");
const { getUserTarget, getFormattedDateFound } = require("../../shiny.js");

module.exports = class ShiniesCommand extends Command {
  constructor (client) {
    super (client, {
      name: "shinies",
      group: "game",
      memberName: "shinies",
      description: "Allows you to view shinies found by a user.",
      details: "",
      args: [
        {
          key: "user",
          prompt: "",
          type: "user"
        }
      ],
      examples: [".yu shinies <@user>"]
    })
  };

  async run(msg, { user }) {

    db.getConnection((err, con) => {

        let sql = 'SELECT * FROM users WHERE id = ?';
        let values = [user.id];

        con.query(sql, values, async (err, rows) => {
            if (err) throw err;

            let found = rows[0].shinies_found;
            let target = await getUserTarget(msg);

            if (!target) target = "None";

            sql = 'SELECT * FROM shinies WHERE owner_id = ? ORDER BY date_found DESC LIMIT ?';
            values = [user.id, found];

            // Get all the shinies found by the given user, sorted by date_found descending
            con.query(sql, values, async (err, rows2) => {
                if (err) throw err;

                let embedDesc = "";

                /**
                 * Construct embed description with format:
                 * | ***User's Shinies***
                 * | **1) shiny1** - odds1 - dateFound1
                 * | ...
                 * | **n) shinyn** - oddsn - dateFoundn
                 * | Footer: Current target: target
                 */
                for (let i = 0; i < rows2.length; i++) {
                    const elem = rows2[i];
                    const date = await getFormattedDateFound(user, elem.name);
                    let next = `**${i + 1}) ${elem.name}** - **${elem.odds}** odds - Found **${date}**\n`;
                    embedDesc += next;
                }

                const embed = new MessageEmbed()
                .setColor(0x7900a8)
                .setTitle(`***${user.username}'s Shinies***`)
                .setDescription(embedDesc)
                .setFooter(`Current target: ${target}`);

                msg.channel.send(embed);
            });
        });

        con.release();
    });

  }
}