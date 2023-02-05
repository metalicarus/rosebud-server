const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../config/database.config');
const ProductionCountry = require('./productionCountry.model');

class Movie extends Model { }

Movie.init({
  title: { type: Sequelize.STRING, allowNull: false },
  status: { type: Sequelize.STRING, allowNull: false },
  imdbId: { type: Sequelize.STRING, allowNull: true, },
  originalLanguage: { type: Sequelize.STRING, allowNull: false, },
  originalTitle: { type: Sequelize.STRING, allowNull: false, },
  overview: { type: Sequelize.TEXT, allowNull: true },
  posterPath: { type: Sequelize.STRING, allowNull: true },
  releaseDate: { type: Sequelize.DATE, allowNull: false },
}, { sequelize });

Movie.hasMany(ProductionCountry.ProductionCountry, { foreignKey: 'movieId'});
ProductionCountry.ProductionCountry.belongsTo(Movie, { foreignKey: 'movieId' });

module.exports = {
  Movie
};
