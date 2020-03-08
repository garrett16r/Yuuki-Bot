/*
This file contains any methods that are used in multiple other files.
These should generally be relatively simple utility methods that help make the code more readable and concise.
*/

let getDate = () => {
  const today = new Date();
  return (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
}

module.exports = { getDate }
