import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {
  private url: string = 'http://localhost:3080/';
  private data = new BehaviorSubject("")
  private last_query: string = "";
  private query_result: any[] = [];
  private page: number = 1;
  private total_pages: number = 1;
  currentData = this.data.asObservable();

  constructor(private http: HttpClient) {

  }

  async findMovies(query: string): Promise<any> {
    return new Promise(resolve => {
      if (this.last_query != query) {
        this.last_query = query;
        this.page = 1;

        this.http.get(`${this.url}movie/find/${query}/${this.page}`).subscribe((res: any) => {
          this.total_pages = res.total_pages;
          this.query_result = res.results;

          resolve(this.query_result);
        });
      } else if (this.page < this.total_pages) {
        this.page++;
        this.http.get(`${this.url}movie/find/${this.last_query}/${this.page}`).subscribe((res: any) => {
          this.query_result = this.query_result.concat(res.results);

          resolve(this.query_result);
        });
      } else {
        resolve(this.query_result);
      }
    })
  }
}
