const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require(path.join(__dirname, '/routes/route.js')))

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});