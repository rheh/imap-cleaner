const fs = require('fs');
const path = './config/connection.json';

module.exports = function configReader() {
  const data = fs.readFileSync(path, {
    encoding: 'utf8',
  });

  return JSON.parse(data.toString());
};
