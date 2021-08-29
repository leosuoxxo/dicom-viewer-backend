const path = require('path');
const fs = require('fs');
const files = fs.readdirSync(path.join(__dirname, '/errors'));

module.exports = files.reduce((acc, fileName) => {
  return acc.concat(require(`./errors/${fileName}`));
}, []);
