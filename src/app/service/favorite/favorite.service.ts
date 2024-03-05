import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FavoriteService {
  private url: string = 'http://localhost:3080/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  setFavorite(movie: Movie): boolean {
    if (!this.authService.isLoggedIn())
      return false;

    const url = `${this.url}movie/favorite/${movie.id}?user_id=${this.authService.getUserId()}`;

    if (movie.favorite)
      this.http.post(url, null).subscribe(() => {});
    else
      this.http.delete(url).subscribe(() => {});

    return true;
  }
}
