const { Command } = require('discord.js-commando');

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      group: "util",
      memberName: "clear",
      description: "Clears the given number of messages from the given channel",
      details: "",
      args: [
        {
          key: "amount",
          prompt: "How many messages do you want to clear?",
          type: "float"
        }
      ],
      examples: [".yu clear 10", ".yu clear"]
    });
  }

  async run(msg, { amount }) {
    const channel = msg.channel;
    channel.bulkDelete(amount + 1); // Clears the designated number of messages plus the command message

    // Send a confirmation message, then delete it after 5 seconds.
    msg.reply(`cleared ${amount} messages from #${channel.name}!`)
      .then(msg => {
        msg.delete({ timeout: 4000 });
      }).catch(err => {});
  }
}
