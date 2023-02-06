const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../config/database.config');
const Movie = require('./movie.model').Movie;

class Genre extends Model { }

Genre.init({
  name: { type: Sequelize.STRING, allowNull: false },
}, { sequelize });

Genre.belongsToMany(Movie, { through: 'MovieGenres', foreignKey: 'movieId', otherKey: 'genreId' });
Movie.belongsToMany(Genre, { through: 'MovieGenres', foreignKey: 'movieId', otherKey: 'genreId' });


module.exports = {
  Genre
};