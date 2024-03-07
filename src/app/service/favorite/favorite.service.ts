import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FavoriteService {
  public set$: EventEmitter<Movie> = new EventEmitter();
  
  private url: string = 'http://localhost:3080/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  setFavorite(movie: Movie): boolean {
    if (!this.authService.isLoggedIn())
      return false;

    this.set$.emit(movie);

    const url = `${this.url}movie/favorite/${movie.id}?user_id=${this.authService.getUserId()}`;

    if (movie.favorite)
      this.http.post(url, null).subscribe();
    else
      this.http.delete(url).subscribe();

    return true;
  }

  getFavorites(): Promise<Movie[]> {
    return new Promise(resolve => {
      if (this.authService.isLoggedIn()) {
        this.http.get(`${this.url}movie/favorite?user_id=${this.authService.getUserId()}`).subscribe((res: any) => {
          resolve(res.map(Movie.mapMovies));
        });
      } else {
        resolve([]);
      }
    })
  }
}
