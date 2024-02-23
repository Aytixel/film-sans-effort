export class Movie {
    id: number;
    title: string;
    image: string;
    favori: boolean;

    constructor(id: number, title: string, image: string, favori: boolean = false) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.favori = favori;
    }
}
