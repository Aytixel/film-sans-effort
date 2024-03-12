import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { PopularService } from '../../service/popular/popular.service';

@Component({
  selector: 'app-popular-list',
  template: `
    <div *ngIf="popularMovieList.length > 0" class="row">
        <app-card-list [title]="popularTitle" [movieList]="popularMovieList"></app-card-list>
    </div>
  `,
})
export class PopularListComponent {
  popularTitle = 'Popular';
  popularMovieList: Movie[] = [];

  constructor(private popularService: PopularService) {

    this.popularService.set$.subscribe(movies_to_set => {
      if (Array.isArray(movies_to_set)) {
        movies_to_set.forEach(movie_to_set => {
          const movie_index = this.popularMovieList.findIndex(movie => movie.id == movie_to_set.id);
          if (movie_index < 0)
            this.popularMovieList.push(movie_to_set);
          else
            this.popularMovieList[movie_index] = movie_to_set;
        });
      } else {
        console.error('movies_to_set is not an array:', movies_to_set);
      }
    });
  }

  async ngOnInit() {
    this.popularMovieList = await this.popularService.getPopular();
  }
}
