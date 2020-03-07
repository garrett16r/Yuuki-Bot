const { Command } = require('discord.js-commando');
const { Client, RichEmbed } = require('discord.js');
const { LolApi, Constants } = require('twisted');

module.exports = class LolStatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lolstats",
      aliases: ["ls", "lol"],
      group: "game",
      memberName: "lolstats",
      description: "Returns the stats of a given Summoner",
      details: "",
      args: [
        {
          key: "summonerName",
          prompt: "Enter the name of the Summoner whose stats you want to check",
          type: "string"
        }
      ],
      examples: [".yu lolstats <summoner name>", ".yu lolstats", ".yu lol", ".yu ls"]
    });
  }

  async run(msg, { summonerName }) {
    const api = new LolApi();
    const summoner = await api.Lol.Summoner.getByName(summonerName, Constants.Regions.AMERICA_NORTH);

    console.log(summoner);
  }
}
