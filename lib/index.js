'use strict';

require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const path = require('path');

const { getRNG } = require("./util.js");
const { getRandomEmote } = require("./reactions.js");
const { checkBannedWords } = require("./banned-terms.js");

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  {
    name: 'clear5',
    description: 'Clears 5 messages from the chat'
  },
  {
    name:'clear10',
    description: 'Clears 10 messages from the chat'
  }
]; 

// Setup slash commands system
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async msg => {

  if (msg.author.bot) return;

  if (getRNG(30) == 0) {
    var emote = getRandomEmote();
    msg.react(emote);
  }

  checkBannedWords(msg);
});

// Command handlers
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    console.log('Pinged!');
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'clear5') {

    interaction.channel.bulkDelete(6);
    await interaction.reply(`Cleared 5 messages from #${interaction.channel.name}!`)
    
    setTimeout(async () => {
      interaction.channel.bulkDelete(1);
    }, 4000);
  }

  if (interaction.commandName === 'clear10') {
    interaction.channel.bulkDelete(11);
    await interaction.reply(`Cleared 10 messages from #${interaction.channel.name}!`)
    
    setTimeout(async () => {
      interaction.channel.bulkDelete(1);
    }, 4000);
  }
});

client.login(process.env.TOKEN)
  .then(() => {
    client.isBroadcasting = false
    client.user.setActivity("hi im an anime gril xd");
  });
