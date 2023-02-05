const express = require('express');
require('dotenv').config({ path: './.env' });
const movieController = require('./api/controller/movie.controller');
const genreController = require('./api/controller/genre.controller');
const app = express();
const database = require('./config/database.config');


app.use('/api/movie', movieController);
app.use('/api/genre', genreController);
 
app.listen(3000, () => {
  database.connect();
  console.log('Server listening on port 3000');
});