const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../config/database.config');
const Movie = require('./movie.model').Movie;

class ProductionCompany extends Model { }

ProductionCompany.init({
  logoPath: { type: Sequelize.STRING, allowNull: true },
  name: { type: Sequelize.STRING, allowNull: false },
  originCountry: { type: Sequelize.STRING, allowNull: true },
}, { sequelize });

ProductionCompany.belongsToMany(Movie, { through: 'MovieCompanies', foreignKey: 'movieId', otherKey: 'companyId' });
Movie.belongsToMany(ProductionCompany, { through: 'MovieCompanies', foreignKey: 'movieId', otherKey: 'companyId' });


module.exports = {
  ProductionCompany
};