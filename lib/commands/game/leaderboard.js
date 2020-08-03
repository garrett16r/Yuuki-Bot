const { Command } = require('discord.js-commando');
const { Client, MessageEmbed } = require('discord.js');
const db = require('../../db/db.js');

module.exports = class LeaderboardCommand extends Command {
  constructor (client) {
    super (client, {
      name: "leaderboard",
      aliases: ["lb"],
      group: "game",
      memberName: "leaderboard",
      description: "Displays the XP of the top 10 users",
      details: "",
      args: [],
      examples: [".yu leaderboard", ".yu lb"]
    })
  };

  async run(msg) {

    const global = this; // Required to access client from within con.query()
    let sql = 'SELECT * FROM users ORDER BY experience DESC LIMIT 10';

     db.getConnection((err, con) => {
       con.query(sql, (err, rows) => {
        if (err) throw err;
        
        var embedDesc = "";

        /**
         * Construct embed description with format:
         * 
         * | **Leaderboard**
         * | 1) user1 - Level x (y XP)
         * | 2) user2 - Level a (b XP)
         * | ...
         * | 10) user10 - Level c (d XP) 
         */
        for (let i = 0; i < rows.length; i++) {
          const elem = rows[i];
          let user = global.client.users.cache.get(elem.id);
          let next = (`**${i + 1}) ${user.username}** - Level **${elem.level + 1}** (**${elem.experience}** XP)\n`);

          embedDesc += next;
        }

        const embed = new MessageEmbed()
        .setTitle("***XP Leaderboard***")
        .setColor(0x7900a8)
        .setDescription(embedDesc);

        msg.channel.send(embed)
        .catch(err => {
          console.log(err);
        });
      })
    })
  }
}