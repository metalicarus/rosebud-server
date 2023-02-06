const express = require('express');
const { sequelize } = require('../../config/database.config');
const router = express.Router();
const MovieDB = require('moviedb')(process.env.TMDB_KEY);
const Movie = require('../model/movie.model').Movie;
const ProductionCountry = require('../model/productionCountry.model').ProductionCountry;
const Genre = require('../model/genre.model').Genre;
const ProductionCompany = require('../model/productionCompany.model').ProductionCompany;

getMovieById = async (id) => {
    return await Movie.findByPk(id, {
        include: [ProductionCountry, Genre, ProductionCompany],
    });
}
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
    let find = await getMovieById(id);
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
        await sequelize.sync({ force: false }).then(async () => {
            await Movie.create({
                id: result.id,
                title: result.title,
                status: result.status,
                imdbId: result.imdb_id,
                originalLanguage: result.original_language,
                originalTitle: result.original_title,
                overview: result.overview,
                posterPath: result.poster_path,
                releaseDate: result.release_date,
            })
                .then(async movie => {
                    for (const genre of result.genres) {
                        await movie.addGenre(genre.id);
                    }
                    for (const x of result.production_countries) {
                        await ProductionCountry.create({
                            movieId: movie.id,
                            iso: x.iso_3166_1,
                            name: x.name,
                        });
                    }
                    for (const x of result.production_companies) {
                        if (await ProductionCompany.findByPk(x.id) === null) {
                            await ProductionCompany.create({
                                id: x.id,
                                logoPath: x.logo_path,
                                name: x.name,
                                originCountry: x.origin_country
                            });
                        }
                        await movie.addProductionCompany(x.id);
                    }
                    find = await getMovieById(id);
                });
            });        
    }
    response.send(find);
});

module.exports = router;