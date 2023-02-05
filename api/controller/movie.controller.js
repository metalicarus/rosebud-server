const express = require('express');
const { sequelize } = require('../../config/database.config');
const router = express.Router();
const MovieDB = require('moviedb')(process.env.TMDB_KEY);
const Movie = require('../model/movie.model').Movie;
const ProductionCountry = require('../model/productionCountry.model').ProductionCountry;

router.get('/search', async (req, res) => {
        const title = req.query.title;
        const page = req.query.page || 1;
        const result = await new Promise((resolve, reject) => {
            MovieDB.searchMovie({ query: title, page: page }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
        res.send(result);
});
router.get('/:id', async (request, response) => {
    const id = request.params.id;

    const find = await Movie.findByPk(id, {
        include: [{
            model: ProductionCountry
        }],
    });
    if (find === null) {
        const result = await new Promise((resolve, reject) => {
            MovieDB.movieInfo({ id: id }, (error, response) => {
                if (error) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
        const movie = await Movie.create({
            id: result.id,
            title: result.title,
            status: result.status,
            imdbId: result.imdb_id,
            originalLanguage: result.original_language,
            originalTitle: result.original_title,
            overview: result.overview,
            posterPath: result.poster_path,
            releaseDate: result.release_date,
        }).catch(err => {
            console.log(err);
        });
        result.production_countries.forEach(async (x) => {
            await ProductionCountry.create({
                movieId: movie.id,
                iso: x.iso_3166_1,
                name: x.name,
            });
        });
        find = movie;
    }
    response.send(find);
});

module.exports = router;