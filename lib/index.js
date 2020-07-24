'use strict';

require('dotenv').config();

const Discord = require('discord.js');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const Sequelize = require('sequelize');

const { COMMANDS_ID } = require("./constants");

const client = new CommandoClient({
  commandPrefix: '.yu',
  owner: process.env.OWNER_ID,
  disableEveryone: true,
  unknownCommandResponse: false
});

const sequelize = new Sequelize('yuuki-bot', 'postgres', '50164', {
  host: 'localhost',
  dialect: 'sqlite',
  loggine: false,
  storage: 'database.sqlite'
});

const XP = sequelize.define('xp', {
  user: {
    type: Sequelize.STRING,
    unique: true
  },
  level: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  xp: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
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
  XP.sync();
});

client.on('message', message => {
  if (message.content.toLowerCase().includes("clod")) {
    message.react("695489608196161546");
  }

  if (message.author.id === "268563083071324170") {
    message.react("735994582629613658");
    console.log("KiriLaugh xd");
  }
})

client.login(process.env.TOKEN)
  .then(() => {
    client.isBroadcasting = false
    client.user.setActivity(".yu help all");
  })
