'use strict';

require('dotenv').config();

const Discord = require('discord.js');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const mysql = require("mysql");

const { COMMANDS_ID } = require("./constants.js");
const { getRNG } = require("./util.js");
const { updateXP } = require("./xp.js");

// MySQL Setup
var con = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.DATABASE
});

const client = new CommandoClient({
  commandPrefix: '.yu',
  owner: process.env.OWNER_ID,
  disableEveryone: true,
  unknownCommandResponse: false
});

// Registers command groups for organization
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['misc', 'Misc'],
    ['util', 'Util'],
    ['game', 'Game']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval_: false,
    commandState: true
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

// Allow commands to be sent only in the bot-commands channel, except for the clear and say commands, which can be used anywhere
client.dispatcher.addInhibitor(msg => {
  return (msg.channel.id !== COMMANDS_ID && !msg.content.includes(".yu clear") && !msg.content.includes(".yu say"));
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  // If the user is not a bot, update their XP/level
  if (!msg.author.bot) {
    updateXP(msg, con);
  }

  if (msg.content.toLowerCase().includes("clod")) {
    msg.react("695489608196161546");
  }
  
  if (getRNG(20) == 0) {
    msg.react("736038262304407562");
    console.log("KiriLaugh xd");
  }

  if (getRNG(1024) == 0) {
    console.log("----------------------\nSHINY MESSAGE\n----------------------");
    msg.reply("You got the shiny message with odds of 1/1024!\nhttps://tenor.com/view/salandit-pokemon-shiny-gif-13428076");
  }

  if (getRNG(4096) == 0) {
    console.log("----------------------\nSHINY MESSAGE\n----------------------");
    msg.reply("You got the shiny message with odds of 1/4096!\nhttps://tenor.com/view/pokemon-slowpoke-shiny-eyes-fuck-yeah-gif-16027713");
  }

  if (getRNG(100000) == 0) {
    console.log("----------------------\nSHINY MESSAGE\n----------------------");
    msg.reply("I DIDN'T MENTION THIS BUT WHOEVER GETS THIS EARNS $10 FROM BOTH OTHER PEOPLE... 1/100,000 odds btw.\nhttps://tenor.com/view/yuuki-sao-peace-sign-sword-art-online-gif-16072058");
  }
});

client.login(process.env.TOKEN)
  .then(() => {
    client.isBroadcasting = false
    client.user.setActivity(".yu help all");
  })

module.exports = { con };