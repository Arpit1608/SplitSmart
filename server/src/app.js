const express = require('express');
const fs = require('fs');
const path = require('path');
const { clientDist } = require('./config/env');
const routes = require('./routes');
const { apiNotFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '1mb' }));

// All API endpoints live under /api
app.use('/api', routes);
app.use('/api', apiNotFound);

// In production, serve the built React app. (In development, Vite serves it on :5173.)
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use(errorHandler);

module.exports = app;
