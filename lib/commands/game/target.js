const { Command } = require('discord.js-commando');
const { Client, MessageEmbed } = require('discord.js');
const db = require("../../db/db.js");
const { getUserTarget, updateUserTarget, getShinySprite } = require("../../shiny.js");

module.exports = class TargetCommand extends Command {
  constructor (client) {
    super (client, {
      name: "target",
      group: "game",
      memberName: "target",
      description: "Allows you to view or set your current shiny target",
      details: "",
      args: [
        {
          key: "target",
          prompt: "Enter a target name to set your target, or use \'view\' to check your current target",
          type: "string"
        }
      ],
      examples: [".yu target Treecko", ".yu target view"]
    })
  };

  sendEmbed = async (msg, embedDesc, target) => {

    const sprite = await getShinySprite(msg, target);

    const embed = new MessageEmbed()
    .setColor(0x7900a8)
    .setTitle(`***${msg.author.username}'s Target***`)
    .setDescription(embedDesc)
    .attachFiles([`./res/sprites/${sprite}`])
    .setImage(`attachment://${sprite}`);

    msg.channel.send(embed);
  }

  async run(msg, { target }) {
    try {
      var embedDesc = "";

        if (target == "view") {
            let userTarget = await getUserTarget(msg);

            if (!userTarget) return msg.reply("you haven't set a shiny target yet!");

            embedDesc += (`Your current target is **${userTarget}**!`);
            this.sendEmbed(msg, embedDesc, userTarget);

        } else {
            updateUserTarget(msg, target);

            embedDesc += (`Your target has been set to **${target}**!`);
            this.sendEmbed(msg, embedDesc, target);
        }
    } catch (err) {
        console.error(err);
    }
  }
}