import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from '../../components/movie';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FindMoviesService {
  private url: string = 'http://localhost:3080/';
  private last_query: string = "";
  private query_result: Movie[] = [];
  private page: number = 1;
  private total_pages: number = 1;

  constructor(private http: HttpClient, private authService: AuthService) {

  }

  async findMovies(query?: string): Promise<Movie[]> {
    const auth_params = this.authService.isLoggedIn() ? `?user_id=${this.authService.getUserId()}`: "";

    return new Promise(resolve => {
      if (query && this.last_query != query) {
        this.last_query = query;
        this.page = 1;

        this.http.get(`${this.url}movie/find/${query}/${this.page}${auth_params}`).subscribe((res: any) => {
          this.total_pages = res.total_pages;
          this.query_result = res.results.map(this.mapMovies);

          resolve(this.query_result);
        });
      } else if (this.page < this.total_pages) {
        this.page++;
        this.http.get(`${this.url}movie/find/${this.last_query}/${this.page}${auth_params}`).subscribe((res: any) => {
          this.query_result = this.query_result.concat(res.results.map(this.mapMovies));

          resolve(this.query_result);
        });
      } else {
        resolve(this.query_result);
      }
    })
  }
  
  private mapMovies(movie: { id: number; title: string; poster: string; favorite: boolean }): Movie {
    return new Movie(movie.id, movie.title, movie.poster ? "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + movie.poster : "", movie.favorite );
  }
}
