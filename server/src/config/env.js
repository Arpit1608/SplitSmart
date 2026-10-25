const path = require('path');

// Load the .env file that lives in the project root (next to the root package.json).
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const serverRoot = path.resolve(__dirname, '../..');

module.exports = {
  port: Number(process.env.PORT) || 4000,
  // Where the JSON "database" is stored. Override with DB_FILE in .env if you like.
  dbFile: process.env.DB_FILE
    ? path.resolve(process.env.DB_FILE)
    : path.join(serverRoot, 'data', 'data.json'),
  // The built React app (created by `npm run build`). Served in production.
  clientDist: path.resolve(serverRoot, '../client/dist'),
};
