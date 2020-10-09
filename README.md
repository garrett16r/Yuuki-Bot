# Yuuki-Bot v1.8.1
A discord.js-based Discord bot for personal use. Yes these commit messages are extremely dumb.

## Todo
- Give Noah a therapy bot because this is the age we live in (make him code it if he wants it)

## Requirements
- NodeJS >= 12.0
- MySQL >= 8.0

## Setup
```sql
/* in MySQL: */
CREATE DATABASE yuuki;
```
```pwsh
# in Terminal or Windows PowerShell:
cp .env.sample .env
npm install
npm start
```
Be sure to start the bot twice the first time in order to be sure all Pokemon data is read in correctly. Apparently it doesn't like reading in 900+ records at once. Or that may just be my computer. I'm actually not sure anymore.
