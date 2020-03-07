const { Command } = require('discord.js-commando');
const { Client, RichEmbed } = require('discord.js');

module.exports = class LolStatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lolstats",
      aliases: ["ls, lol"],
      group: "game",
      memberName: "lolstats",
      description: "Returns the stats of a given Summoner",
      details: "",
      args: [
        {
          key: "summoner",
          prompt: "Enter the name of the Summoner whose stats you want to check",
          type: "string"
        }
      ],
      examples: [".yu lolstats <summoner name>", ".yu lolstats", ".yu lol", ".yu ls"]
    });
  }

  async run(msg, { summoner }) {
    
  }
}
