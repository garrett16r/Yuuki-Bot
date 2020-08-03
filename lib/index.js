'use strict';

require('dotenv').config();

const Discord = require('discord.js');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');

const { getRNG, getChannel } = require("./util.js");
const { updateXP } = require("./xp.js");
const { createTables } = require("./db/tables.js");

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

  // If the user is not a bot, update their XP/level
  if (!msg.author.bot) {
    updateXP(msg);
  }

  if (msg.content.toLowerCase().includes("clod")) {
    msg.react("695489608196161546");
  }
  
  if (getRNG(20) == 0) {
    msg.react("736038262304407562")
      .catch(err => console.log(err));
      
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