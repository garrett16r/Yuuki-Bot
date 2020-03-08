let getDate = () => {
  const today = new Date();
  return (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
}

module.exports = { getDate }
