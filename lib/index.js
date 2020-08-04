'use strict';

require('dotenv').config();

const Discord = require('discord.js');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');

const { getRNG, getChannel } = require("./util.js");
const { updateXP } = require("./xp.js");
const { createTables } = require("./db/tables.js");
const { checkIfShiny } = require("./shiny.js");

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


// Allow commands to be sent only in the bot-commands channel, except for the clear, say, and setchannel commands, which can be used anywhere
function inhibitor() {

  getChannel('commands', processChanID);

  function processChanID(chanID) {
    if (!chanID) return;

    console.log("Inhibitor set!");
    client.dispatcher.addInhibitor(msg => {
      return (msg.channel.id !== chanID && !msg.content.includes(".yu clear") && !msg.content.includes(".yu say") && !msg.content.includes(".yu setchan") && !msg.content.includes(".yu sc"));
    });
  }
}

exports.inhibitor = inhibitor;

async function config() {
  try {
    await createTables();
    await inhibitor();
  } catch(err) {
    console.error(err);
  }
};

client.on('ready', () => {
  config();
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  // If the user is not a bot, update their XP/level and check for a shiny message
  if (!msg.author.bot) {
    updateXP(msg);
    checkIfShiny(msg);
  }

  if (msg.content.toLowerCase().includes("clod")) {
    msg.react("695489608196161546");
  }
  
  if (getRNG(20) == 0) {
    msg.react("736038262304407562")
      .catch(err => console.log(err));
      
    console.log("KiriLaugh xd");
  }

  
});

client.login(process.env.TOKEN)
  .then(() => {
    client.isBroadcasting = false
    client.user.setActivity(".yu help all");
  })