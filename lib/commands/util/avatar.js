const { Command } = require('discord.js-commando');
const { GERNEAL_ID } = require('../../constants.js');
const { inCommandChannel } = require('./../../util.js');

module.exports = class AvatarCommand extends Command {
  constructor (client) {
    super (client, {
      name: "avatar",
      group: "misc",
      memberName: "avatar",
      description: "Sends a link to the avatar of the mentioned user",
      details: "",
      args: [
        {
          key: "user",
          prompt: "Which user's avatar would you like to retrieve? (Use their @)",
          type: "user"
        }
      ],
      examples: [".yu avatar <@user>", ".yu avatar"]
    })
  };

  async run(msg, { user }) {
    msg.reply(user.avatarURL);
  }
}
