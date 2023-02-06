const express = require('express');
const { sequelize } = require('../../config/database.config');
const router = express.Router();
const ProductionCompany = require('../model/productionCompany.model').ProductionCompany;

router.get('/findAll', async (request, response) => {
    response.status(200).send(await ProductionCompany.findAll());
});
module.exports = router;