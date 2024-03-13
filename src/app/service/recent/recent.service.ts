import { EventEmitter, Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecentService {
  public set$: EventEmitter<Movie[]> = new EventEmitter();

  private url: string = 'http://localhost:3080/';

  constructor(private http: HttpClient) { }

  async getRecent(): Promise<Movie[]> {
    const recent: any = await firstValueFrom(this.http.get(`${this.url}movie/recent`));
    const recentMovie: Movie[] = recent.map(Movie.mapMovies);
    console.log("Film recent", recentMovie);
    return recentMovie;
  }
}
