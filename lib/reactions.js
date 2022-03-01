const { getRNG } = require("./util.js");

const emotes = [
    "<:KiriLaugh:736038262304407562>", 
    "<a:AAAAAAAAshake:804238163102138418>",
    "<:fuckboy:890318688723533855>",
    "<:penis:682849850722877478>",
    "<:pepesmirk:892478166290006016>"
];

const keywords = [];

let getRandomEmote = () => {
    var rng = getRNG(emotes.length);
    return emotes[rng];
}

module.exports = { getRandomEmote };