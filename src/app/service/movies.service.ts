import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {
  url: string;
  apiKey: string;

  constructor(private http: HttpClient) {
    console.log('Charge MoviesService...');
    this.url = 'https://api.themoviedb.org/3/';
    this.apiKey = import.meta.env['NG_APP_TMDB_API_KEY'];
  }

  searchMovies(searchStr: string): Observable<any> {
    return this.http.get(`${this.url}search/movie?api_key=${this.apiKey}&query=${searchStr}`);
  }

  getMoviesByGenre(id: string): Observable<any> {
    return this.http.get(`${this.url}genre/${id}/movies?api_key=${this.apiKey}`);
  }

  getMovieByActors(id: string): Observable<any> {
    return this.http.get(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}`);
  }

  getMovieByRealisators(id: string): Observable<any> {
    return this.http.get(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}`);
  }
}
