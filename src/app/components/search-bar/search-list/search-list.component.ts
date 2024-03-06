import { Component } from '@angular/core';
import { Movie } from '../../movie';
import { FindMoviesService } from '../../../service/find-movies/find-movies.service';

@Component({
  selector: 'app-search-list',
  template: `
    <div *ngIf="searchMovieList.length" class="row">
        <app-card-list [title]="searchTitle" [movieList]="searchMovieList" (onEndReached)="nextMovies()"></app-card-list>
    </div>
  `,
})
export class SearchListComponent {
  searchTitle = 'Recherche';
  searchMovieList: Movie[] = [];
  
  constructor(private findMoviesService: FindMoviesService) {
    this.findMoviesService.update$.subscribe(movies => this.searchMovieList = movies)
  }

  nextMovies() {
    if (this.searchMovieList.length)
      this.findMoviesService.findMovies();
  }
}
