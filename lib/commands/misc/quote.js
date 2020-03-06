const { Command } = require('discord.js-commando');
const { QUOTES_ID } = require('../../constants.js');
const { inCommandChannel } = require('./../../util.js');
const { Client, RichEmbed } = require('discord.js');

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
          prompt: "Which user are you quoting?",
          type: "user",
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
      examples: [".yu quote @Syn \'Wow what a funny quote\' 3/6/2020", ".yu quote"]
    })
  };

  async run(msg, { user, content, date }) {

    const channel = this.client.channels.get(QUOTES_ID);

    const embed = new RichEmbed()
    .setTitle("@" + user.tag)
    .setColor(0x7900a8)
    .setDescription("\'" + content + "\'\n\n"
                  + "**" + date + "**");

    channel.send(embed);
  }
}
