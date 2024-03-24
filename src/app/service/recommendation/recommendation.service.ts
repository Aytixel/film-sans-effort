import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable()
export class RecommendationService {
  public set$: EventEmitter<Movie[]> = new EventEmitter();

  private url: string = '/';
  private query_result: Movie[] = [];
  private page: number = 1;
  private is_finished: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getRecommendations(next: boolean = false): Promise<Movie[]> {
    if (!this.authService.isLoggedIn())
      return [];

    if (!next) {
      // charge la première page de recommendation
      this.query_result = [];
      this.page = 1;
      this.is_finished = false;
    } else {
      // charge la page suivante de recommendation
      this.page++;
    }

    if (!this.is_finished) {
      const movies: any = await firstValueFrom(this.http.get(`${this.url}movie/recommendation/${this.page}?user_id=${this.authService.getUserId()}`));

      if (movies.length)
        this.query_result = this.query_result.concat(movies.map(Movie.mapMovies));
      else
        this.is_finished = true;
    }

    return this.query_result;
  }
}
