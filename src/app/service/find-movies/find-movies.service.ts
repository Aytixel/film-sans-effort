import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from '../../components/movie';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FindMoviesService {
  public update$: EventEmitter<Movie[]> = new EventEmitter();

  private url: string = '/';
  private last_query: string = "";
  private query_result: Movie[] = [];
  private page: number = 1;
  private total_pages: number = 1;

  constructor(private http: HttpClient, private authService: AuthService) { }

  findMovies(query?: string) {
    const auth_params = this.authService.isLoggedIn() ? `?user_id=${this.authService.getUserId()}`: "";

    if (query && this.last_query != query) {
      this.last_query = query;
      this.page = 1;

      this.http.get(`${this.url}movie/find/${query}/${this.page}${auth_params}`).subscribe((res: any) => {
        this.total_pages = res.total_pages;
        this.query_result = res.results.map(Movie.mapMovies);

        this.update$.emit(this.query_result);
      });
    } else if (this.page < this.total_pages) {
      this.page++;

      this.http.get(`${this.url}movie/find/${this.last_query}/${this.page}${auth_params}`).subscribe((res: any) => {
        this.query_result = this.query_result.concat(res.results.map(Movie.mapMovies));

        this.update$.emit(this.query_result);
      });
    } else {
      this.update$.emit(this.query_result);
    }
  }
}
