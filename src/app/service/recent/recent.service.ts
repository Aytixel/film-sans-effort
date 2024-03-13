import { Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecentService {
  private url: string = 'http://localhost:3080/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getRecent(): Promise<Movie[]> {
    const auth_params = this.authService.isLoggedIn() ? `?user_id=${this.authService.getUserId()}`: "";

    return (await firstValueFrom(this.http.get(`${this.url}movie/recent${auth_params}`)) as any).map(Movie.mapMovies);
  }
}
