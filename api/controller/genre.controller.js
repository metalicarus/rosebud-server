const express = require('express');
const router = express.Router();
const GenreDB = require('moviedb')(process.env.TMDB_KEY);
const Genre = require('../model/genre.model').Genre;

getGenreMovieList = async () => {
    return await new Promise((resolve, reject) => {
        GenreDB.genreMovieList((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }                    
        });
    });
};

getGenreTvList = async () => {
    return await new Promise((resolve, reject) => {
        GenreDB.genreTvList((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }                    
        });
    });
};

router.get('/populate', async (request, response) => {
    const movies = await getGenreMovieList();
    const tvs = await getGenreTvList();
    const genres = [...movies.genres, ...tvs.genres];
    genres.forEach(async element => {
        if (await Genre.findByPk(element.id) === null) {
            Genre.create({
                id: element.id,
                name: element.name,
            });
        }
    });
    response.status(200).send();
});
router.get('/findAll', async (request, response) => {
    const genres = await Genre.findAll();
    response.status(200).send(genres);
});
module.exports = router;