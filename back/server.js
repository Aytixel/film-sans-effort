require("dotenv").config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));



class MoviesService {

    constructor() {
        console.log('Charge MoviesService...');
        this.url = 'https://api.themoviedb.org/3/';
        this.apiKey = process.env['NG_APP_TMDB_API_KEY'];
        this.language = 'fr';
    }

    async searchMovies(searchStr) {
        //return this.http.get(`${this.url}search/movie?api_key=${this.apiKey}&query=${searchStr}&language=${this.language}`);
        const response = await fetch(`${this.url}search/movie?api_key=${this.apiKey}&query=${searchStr}&language=${this.language}`);
        return response.json();
    }

    async getMoviesByGenre(id) {
        //return this.http.get(`${this.url}genre/${id}/movies?api_key=${this.apiKey}&language=${this.language}`);
        const response = await fetch(this.http.get(`${this.url}genre/${id}/movies?api_key=${this.apiKey}&language=${this.language}`));
        return response.json();
    }

    async getMoviesByActors(id) {
        //return this.http.get(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}&language=${this.language}`);
        const response = await fetch(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}&language=${this.language}`);
        return response.json();
    }

    async getMoviesByRealisators(id) {
        //return this.http.get(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}&language=${this.language}`);
        const response = await fetch(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}&language=${this.language}`);
        return response.json();
    }
}

const api = new MoviesService();

const express = require('express');

const cors = require('cors');

const app = express(),
    port = 3080;

app.use(cors());

app.get("/searchmovie", (req, res) => {
    res.json(api.searchMovies());
});

app.get("/searchgenre", (req, res) => {
    res.json(api.getMoviesByGenre());
});

app.get("/searchactor", (req, res) => {
    res.json(api.getMoviesByActor());
});

app.get("/searchreal", (req, res) => {
    res.json(api.getMoviesByRealisators());
});


app.listen(port, () => {
    console.log('Server is running on port 3080');
})