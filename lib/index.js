'use strict';

require('dotenv').config();

const Discord = require('discord.js');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const SQLite = require('better-sqlite3');

const sql = new SQLite('./db.sqlite');

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

  // Check if table "users" exists
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'users';").get();

  if (!table['count(*)']) {
    // If the table doesn't exist, create it with the correct perameters
    sql.prepare("CREATE TABLE users (user_id TEXT PRIMARY KEY, lvl INTEGER, xp INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_users_id ON users (user_id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }

  // Allows retrieval of user xp data
  client.getExp = sql.prepare("SELECT * FROM users WHERE user_id = ?");
  client.setExp = sql.prepare("INSERT OR REPLACE INTO users (user_id, lvl, xp) VALUES (@user_id, @lvl, @xp);");
});

client.on('message', msg => {

  let user = client.getExp.get(msg.author.id);

  if (!user) {
    user = {
      user_id: `${msg.author.id}`,
      lvl: 1,
      xp: 0
    }
  }

  user.xp++;

  // Calculate current level through some math idk
  const curLvl = Math.floor(0.4 * Math.sqrt(user.xp));

  // Check if the user has leveled up
  if (user.lvl < curLvl) {
    user.lvl++;
    msg.reply(`You've leveled up to Level ${curLvl}! Sugoi desu ne >_<`);

    // Delete notification after 4 seconds
    var timeout = setTimeout (function () {
      msg.channel.bulkDelete(1);
    }, 4000);
  }
  
  if (message.author.id === "165293945008422912") {
    message.react("733535473120706610");
    console.log("uwu ner baka desu ne");
  }

  client.setExp.run(user);

  if (msg.content.toLowerCase().includes("clod")) {
    msg.react("695489608196161546");
  }
  
  if (msg.author.id === "165293945008422912") {
    msg.react("733535473120706610");
    console.log("uwu ner baka desu ne");
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
    msg.reply("I didn't mention this but whoever gets this earns $10 from both other people... 1/100,000 odds btw.\nhttps://tenor.com/view/yuuki-sao-peace-sign-sword-art-online-gif-16072058");
  }
});

client.login(process.env.TOKEN)
  .then(() => {
    client.isBroadcasting = false
    client.user.setActivity(".yu help all");
  })
