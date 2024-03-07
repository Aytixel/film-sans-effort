export class Movie {
    id: number;
    title: string;
    poster: string;
    genres: string[];
    favorite: boolean;

    constructor(id: number, title: string, poster: string, favori: boolean = false, genres: string[]) {
        this.id = id;
        this.title = title;
        this.poster = poster;
        this.genres = genres;
        this.favorite = favori;
    }

    static mapMovies(movie: { id: number; title: string; poster: string; favorite: boolean; genres: string[] }): Movie {
        return new Movie(movie.id, movie.title, movie.poster ? "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + movie.poster : "", movie.favorite, movie.genres );
    }
}
