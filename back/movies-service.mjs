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

    async findPopularMovie() {
        return (await fetch(`${this.url}movie/popular?language=${this.language}&page=1&api_key=${this.apiKey}`)).json();
    }

    async findRecentMovie() {
        return (await fetch(`${this.url}movie/now_playing?language=${this.language}&page=1&api_key=${this.apiKey}`)).json();
    }

    async findMovieByGenreId(genreId, page) {
        return (await fetch(`${this.url}discover/movie?with_genres=${genreId}&page=${page}&api_key=${this.apiKey}&language=${this.language}`)).json();
    }

    async getMovieStaff(movie_id) {
        const staff = await (await fetch(`${this.url}movie/${movie_id}/credits?api_key=${this.apiKey}&language=${this.language}`)).json();

        return staff.cast.concat(staff.crew);
    }
}