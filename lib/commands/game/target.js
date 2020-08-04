const { Command } = require('discord.js-commando');
const db = require("../../db/db.js");
const { getUserTarget, updateUserTarget } = require("../../shiny.js");

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

  async run(msg, { target }) {
    try {
        if (target == "view") {
            let userTarget = await getUserTarget(msg);

            if (!userTarget) return msg.reply("you haven't set a shiny target yet!");

            return msg.reply(`your current target is ${userTarget}`)
        } else {
            updateUserTarget(msg, target);
            return msg.reply(`your target has been set to ${target}!`);
        }
    } catch (err) {
        console.error(err);
    }
  }
}