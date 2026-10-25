const { port } = require('./config/env');
const app = require('./app');

app.listen(port, () => console.log(`SplitSmart API running at http://localhost:${port}`));
