const { Command } = require('discord.js-commando');
const db = require('../../db/db.js');

module.exports = class TimeCapsuleCommand extends Command {
  constructor (client) {
    super (client, {
      name: "timecapsule",
      group: "misc",
      memberName: "timecapsule",
      description: "Sets a message to be sent on a given date in the general chat channel.",
      details: "",
      aliases: ["tc"],
      args: [
        {
          key: "date",
          prompt: "On what date will the message be sent? ***Must be in MM/DD/YYYY format***",
          type: "string"
        },
        {
          key: "message",
          prompt: "What's the message?",
          type: "string"
        }
      ],
      examples: [".yu timecapsule <date> <message>"]
    });
  };

  // Confirms that the date is formated as MM/DD/YYYY
  checkDateFormat = async(date) => {
    return new Promise((resolve, reject) => {

      let dateSplitsSlash = date.split('/');
      let dateSplitsDash = date.split('-');

      // Confirm that the date contains exactly 10 characters
      if (date.length !== 10) reject();

      // Don't allow format with dashes
      if (dateSplitsDash.size > 0) reject();

      // Don't allow format missing slashes (possibly redundant)
      if (dateSplitsSlash.size < 2) reject();

      // Confirm that each part of the date is the correct number of digits (also possibly redundant)
      if (dateSplitsSlash[0].length !== 2) reject();
      if (dateSplitsSlash[1].length !== 2) reject();
      if (dateSplitsSlash[2].length !== 4) reject();

      resolve(true);
    });
  }

  async run(msg, { date, message }) {
    db.getConnection(async (err, con) => {
        let sql = 'INSERT INTO time_capsule (user_id, message, send_date) VALUES (?, ?, ?)';
        let values = [msg.author.id, message, date];

        try {
          let isValid = await this.checkDateFormat(date);

          if (isValid) {
            con.query(sql, values);
            msg.delete();
            msg.reply(`Your message has been saved and will be sent on ${date}!`);
          }
        } catch (err) {
          msg.reply(`${date} is an invalid date format! It must be formatted as MM/DD/YYYY (e.g. 04/08/2021)`);
        }
    });
  }
}