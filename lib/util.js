/*
This file contains any methods that are used in multiple other files.
These should generally be relatively simple utility methods that help make the code more readable and concise.
*/

let getRNG = (maxRange) => {
  return Math.floor(Math.random() * maxRange);
}

module.exports = { getRNG }
