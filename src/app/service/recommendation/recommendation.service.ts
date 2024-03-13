import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable()
export class RecommendationService {
  public set$: EventEmitter<Movie[]> = new EventEmitter();

  private url: string = 'http://localhost:3080/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getRecommendations(): Promise<Movie[]> {
    if (!this.authService.isLoggedIn())
      return [];

    const response: any = await firstValueFrom(this.http.get(`${this.url}movie/recommendation/1?user_id=${this.authService.getUserId()}`));

    if (response && Array.isArray(response))
      return response.map(Movie.mapMovies);

    return [];
  }
}
