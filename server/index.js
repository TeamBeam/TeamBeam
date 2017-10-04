const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const routes = require('./routes');
const pg = require('pg');


app.use(express.static('public'));
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect all routes to app
app.use('/', routes)


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
