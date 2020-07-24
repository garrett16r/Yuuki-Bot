'use strict';

require('dotenv').config();

const Discord = require('discord.js');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');

const { COMMANDS_ID } = require("./constants");
const { getRNG } = require("./util.js");

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

// Allow commands to be sent only in the commands channel, except for the clear command.
client.dispatcher.addInhibitor(msg => {
  return (msg.channel.id !== COMMANDS_ID && !msg.content.includes(".yu clear"));
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content.toLowerCase().includes("clod")) {
    message.react("695489608196161546");
  }

  if (getRNG(10) == 0) {
    message.react("736038262304407562");
    console.log("KiriLaugh xd");
  }

  if (getRNG(1024) == 0) {
    message.react("682478442242899979");
    console.log("----------------------\nSHINY MESSAGE\n----------------------");
    message.reply("You got the shiny message with odds of 1/1024!");
  }
});

client.login(process.env.TOKEN)
  .then(() => {
    client.isBroadcasting = false
    client.user.setActivity(".yu help all");
  })
