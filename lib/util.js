let getDate = () => {
  const today = new Date();
  return (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
}

let inCommandChannel = (msg) => {
  return msg.channel.id === COMMANDS_ID;
}

let clearMessages = (msg, amount) => {
  msg.channel.bulkDelete(amount);
}

module.exports = { getDate, inCommandChannel, clearMessages }
