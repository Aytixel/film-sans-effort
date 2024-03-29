import { Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PopularService {
  private url: string = '/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getPopular(): Promise<Movie[]> {
    const auth_params = this.authService.isLoggedIn() ? `?user_id=${this.authService.getUserId()}`: "";

    return (await firstValueFrom(this.http.get(`${this.url}movie/popular${auth_params}`)) as any).map(Movie.mapMovies);
  }
}
