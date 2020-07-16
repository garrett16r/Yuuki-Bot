const { Command } = require('discord.js-commando');

module.exports = class RoleCommand extends Command {
  constructor (client) {
    super (client, {
      name: "role",
      group: "util",
      memberName: "role",
      description: "Allows you to edit your role name and color",
      details: "",
      args: [
        {
          key: "role",
          prompt: "Which role would you like to edit?",
          type: "role"
        },
        {
          key: "property",
          prompt: "Which property would you like to edit? (Name or Color)",
          type: "string"
        },
        {
            key: "value",
            prompt: "What would you like to set the property to? (Text for name, hex value for color (https://www.google.com/search?q=color+picker))",
            type: "string"
        }
      ],
      examples: [".yu role <property> <value>", ".yu role name something stupid", ".yu role color #ff00fb"]
    })
  };

  editName(msg, channel, roleArg, newName) {
    const role = msg.guild.roles.get(roleArg.id);

    console.log(role);

    role.edit({ name: newName });

    channel.send(`Changed role name to ${newName}!`);
  }

  editColor(msg, channel, roleArg, newColor) {
    const role = msg.guild.roles.get(roleArg.id);

    role.edit({ color: newColor });

    channel.send(`Changed role color to ${newColor}!`);
  }

  async run(msg, { role, property, value }) {
    const channel = this.client.channels.get(COMMANDS_ID);

    /*if (!msg.guild.roles.find(r => r.name === role.name)) {
        return msg.reply("You don't have that role!");
    }*/

    if (property.toLowerCase() === "name") {
        this.editName(msg, channel, role, value);
    } else if (property.toLowerCase() === "color") {
        this.editColor(msg, channel, role, value);
    } else {
        return msg.reply("You didn't choose to edit your role name or color!");
    }
  }
}
