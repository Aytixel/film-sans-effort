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
}
