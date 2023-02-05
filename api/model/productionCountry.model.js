const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../config/database.config');

class ProductionCountry extends Model { }

ProductionCountry.init({
  movieId: { type: Sequelize.INTEGER, allowNull: false },
  iso: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
}, { sequelize });


module.exports = {
  ProductionCountry
};