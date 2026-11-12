const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

app.get('/health', (_req, res) => res.status(200).send('ok'));

app.use(express.static(FRONTEND_DIR));

// The diagrams site is a single-page app: its own routes resolve to its index.
app.get('/diagrams/*', (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'diagrams', 'index.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`landing-page listening on :${PORT}`);
});
