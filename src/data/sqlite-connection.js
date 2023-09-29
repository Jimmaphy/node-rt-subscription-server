const sqlite = require('sqlite3');
const database = new sqlite.Database('./src/data/data.db');

function write(content) {
  console.log(content);
}

module.exports = { write };
