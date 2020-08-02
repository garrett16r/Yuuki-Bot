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
    
    const id = await getChannel('quotes');
    console.log(id + " back to quote.js");
    const channel = this.client.channels.cache.get(id);

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
    .setTitle(`@${user.tag}`)
    .setColor(0x7900a8)
    .setDescription(`\" ${content} \"\n\n**${date}**`);

    channel.send(embed)
    .catch(err => {
      console.log(err);
    });
  }
}
