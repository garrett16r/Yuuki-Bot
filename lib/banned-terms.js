const { Client, Intents } = require('discord.js');

const bannedWords = ['garypee', 'gary-pee', 'gary pee', 'gary-kun', 'gary kun', 'garykun'];
const jayBannedWords = ['cum'];

let checkBannedWords = (msg) => {

  // The jay filter
  if (msg.author.id == '192094521889128448') {
      jayBannedWords.every(async word => {
          if (msg.content.includes(word)) {
              msg.delete();
              return false;
          }
          return true;
      });
  }

  bannedWords.every(async word => {
    if (msg.content.includes(word)) {
        msg.delete();
        return false;
    }
    return true;
  });
}

module.exports = { checkBannedWords };