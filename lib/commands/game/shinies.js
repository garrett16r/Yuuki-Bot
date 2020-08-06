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

    if (user.bot) return msg.reply("can't check the shinies of a bot!");

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

                let shiniesField = "";
                let oddsField = "";
                let foundField = "";
                let b = "";

                /**
                 * Construct embed description with format:
                 * | ***User's Shinies***                    
                 * | **Name**    **Odds**   **Found**
                 * | 1) shiny1     odds1    dateFound1
                 */
                for (let i = 0; i < rows2.length; i++) {
                    const elem = rows2[i];

                    if (!(i % 2 == 0)) b = '**'; else b = ''; // Makes every other row bold for improved readability

                    const date = await getFormattedDateFound(user, elem.name);
                    shiniesField += `${b}${i + 1}) ${elem.name}${b}\n`;
                    oddsField += `${b}${elem.odds}${b}\n`;
                    foundField += `${b}${date}${b}\n`
                }

                const embed = new MessageEmbed()
                .setColor(0x7900a8)
                .setTitle(`***${user.username}'s Shinies***`)
                //.setDescription(embedDesc)
                .addFields(
                  { name: '**Name**', value: shiniesField, inline: true },
                  { name: '**Odds**', value: oddsField, inline: true },
                  { name: '**Found**', value: foundField, inline: true }
                )
                .setFooter(`Current target: ${target}`);

                msg.channel.send(embed);
            });
        });

        con.release();
    });

  }
}