import fetch from "node-fetch";

export default class MoviesService {
    constructor() {
        this.url = 'https://api.themoviedb.org/3/';
        this.apiKey = process.env['TMDB_API_KEY'];
        this.language = 'fr';
    }

    async findMovies(query, page = 1) {
        return (await fetch(`${this.url}search/movie?query=${query}&page=${page}&api_key=${this.apiKey}&language=${this.language}`)).json();
    }

    async getMoviesByGenre(genre) {
        return (await fetch(`${this.url}genre/${genre}/movies?api_key=${this.apiKey}&language=${this.language}`)).json();
    }

    async getMovieByStaff(name, page = 1) {
        return (await fetch(`${this.url}search/person?query=${name}&page=${page}&api_key=${this.apiKey}&language=${this.language}`)).json();
    }
}