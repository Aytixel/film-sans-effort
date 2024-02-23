import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {
  private url: string = 'http://localhost:3080/';
  private data = new BehaviorSubject("")
  currentData = this.data.asObservable();

  constructor(private http: HttpClient) {

  }

  searchMovies(query: string): Observable<any> {
    return this.http.get(`${this.url}movie/find/${query}`);
  }

  getMoviesByGenre(genre: string): Observable<any> {
    return this.http.get(`${this.url}movie/genre/${genre}`);
  }

  getMovieByStaff(name: string): Observable<any> {
    return this.http.get(`${this.url}movie/staff/${name}`);
  }
}
