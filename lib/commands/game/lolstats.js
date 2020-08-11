require('dotenv').config();

const { Command } = require('discord.js-commando');
const { Client, MessageEmbed, Message } = require('discord.js');
const LeagueJS = require('leaguejs/lib/LeagueJS.js');

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
      examples: [".yu lolstats/lol/ls <summoner name>", ".yu lolstats/lol/ls"]
    });
  }

  sendEmbed = (msg, name, level) => {
    const embed = new MessageEmbed()
      .setColor(0x7900a8)
      .setTitle(`${name}'s Stats`)
      .setDescription(`Level: **${level}**\nOP.GG: https://na.op.gg/summoner/userName=${name}`)

    msg.channel.send(embed);
  }

  async run(msg, { summonerName }) {
    const ljs = new LeagueJS(process.env.LEAGUE_API_KEY);

    ljs.Summoner
      .gettingByName(summonerName)
      .then(data => {
        'use strict';
        console.log(data)
        //msg.reply(`https://na.op.gg/summoner/userName=${data.name}`);
        this.sendEmbed(msg, data.name, data.summonerLevel);
      })
      .catch(err => {
        'use strict';
        msg.reply("Summoner not found! Enter a valid summoner name.");
      });
  }
}
