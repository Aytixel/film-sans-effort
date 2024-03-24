export class Movie {
    id: number;
    title: string;
    poster: string;
    favorite: boolean;

    constructor(id: number, title: string, poster: string, favori: boolean = false) {
        this.id = id;
        this.title = title;
        this.poster = poster;
        this.favorite = favori;
    }

    // fonction pour convertir les objets json en classe Movie
    static mapMovies(movie: { id: number; title: string; poster: string; favorite: boolean; }): Movie {
        return new Movie(movie.id, movie.title, movie.poster ? "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + movie.poster : "", movie.favorite);
    }
}
