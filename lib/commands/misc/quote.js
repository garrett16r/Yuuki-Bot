const { Command } = require('discord.js-commando');
const { Client, MessageEmbed } = require('discord.js');
var { getChannel } = require("../../util.js");

module.exports = class QuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "quote",
      group: "misc",
      memberName: "quote",
      description: "Creates an embed with a quote, name of the user quoted, and the date of the quote.",
      details: "",
      args: [
        {
          key: "user",
          prompt: "Which user are you quoting? (Use their @)",
          type: "user"
        },
        {
          key: "content",
          prompt: "What is the quote?",
          type: "string"
        },
        {
          key: "date",
          prompt: "What is the date of the quote (mm/dd/yyyy)?",
          type: "string",
        }
      ],
      examples: [".yu quote @Syn \'Wow what a funny quote\' 03/06/2020", ".yu quote"]
    })
  };

  async run(msg, { user, content, date }) {

    const global = this; // Needed in order to access 'client' from within processChanID()

      getChannel('quotes', processChanID);

      function processChanID(chanID) {
        const channel = global.client.channels.cache.get(chanID);
  
        if (!channel) {
          return msg.reply(`no channel has been defined as a quotes channel yet! Use '.yu setchannel <#channel> quotes' and try again.`);
        }
  
        /*
        Create embed with layout of:
        | @user#1234
        | "This is a quote"
        | **3/6/2020**
        */
        const embed = new MessageEmbed()
        .setTitle(`***@${user.username}***`)
        .setColor(0x7900a8)
        .setDescription(`\" ${content} \"\n\n**${date}**`);
  
        channel.send(embed)
        .catch(err => {
          console.log(err);
        });
    }
  }
}
