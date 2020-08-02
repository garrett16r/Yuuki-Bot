const { Command } = require('discord.js-commando');
const db = require("../../db/db.js");

module.exports = class SetChannelCommand extends Command {
  constructor (client) {
    super (client, {
      name: "setchannel",
      group: "util",
      memberName: "setchannel",
      description: "Set the designated channel as the general, quotes, or bot commands channel",
      userPermissions: ["MANAGE_CHANNELS"],
      args: [
        {
          key: "channel",
          prompt: "Which channel would you like to assign a type to?",
          type: "channel"
        },
        {
          key: "type",
          prompt: "What type would you like to assign to the channel? (general, quotes, commands, none)",
          type: "string"
        }
      ],
      examples: [".yu channel <#channel> <type>", ".yu #bot-commands commands"]
    })
  };

  async run(msg, { channel, type }) {

    // Prevent an invalid type from being sent
    if (!(type == "general" || type == "quotes" || type == "commands" || type == "none")) {
      return msg.reply("type must be general, quotes, or commands! You can also use 'none' to remove a type from a channel.");
    }

    // Remove channel types
    if (type == "none") {
      db.getConnection((err, con) => {
        con.query(`DELETE FROM channels WHERE id = '${channel.id}'`);

        con.release();
        return msg.reply(`removed channel type from <#${channel.id}>!`);
      });
    }

    // Assign channel types
    db.getConnection((err, con) => {
      con.query(`INSERT INTO channels (id, type) VALUES ('${channel.id}', '${type}')`, (err, rows) => {
        if (err) {
          if (err.code == "ER_DUP_ENTRY") {
            return msg.reply("that channel already has a type assigned to it, or that type has been assigned to another channel! Use '.yu setchannel <#channel> none' to remove it, then try again.");
          }
        }
        
        con.release();
        return msg.reply(`set <#${channel.id}> as ${type} channel!`);
      });
    });
  }
}
