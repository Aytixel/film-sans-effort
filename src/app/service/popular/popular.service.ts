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
    const response: any = await firstValueFrom(this.http.get(`${this.url}movie/popular`));
    if (response && Array.isArray(response.results)) {
      const popularMovies: Movie[] = response.results.map(Movie.mapMovies);
      return popularMovies;
    }
    return [];
  }
}
