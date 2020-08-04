const { Command } = require('discord.js-commando');

module.exports = class AvatarCommand extends Command {
  constructor (client) {
    super (client, {
      name: "avatar",
      group: "util",
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
    msg.reply(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }));
  }
}
