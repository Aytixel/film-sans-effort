import { EventEmitter, Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopularService {
  public set$: EventEmitter<Movie[]> = new EventEmitter();

  private url: string = 'http://localhost:3080/';

  constructor(private http: HttpClient) { }

  async getPopular(): Promise<Movie[]> {

    // Récupérer les films populaires ( app.get("/movie/popular/:page?", async (req, res) => { )
    const popular: any = await firstValueFrom(this.http.get(`${this.url}movie/popular/1`));
    const popularMovie: Movie[] = popular.map(Movie.mapMovies);
    console.log("Film populaire", popularMovie);
    return popularMovie;
  }
}