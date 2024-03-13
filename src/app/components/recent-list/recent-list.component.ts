import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { RecentService } from '../../service/recent/recent.service';

@Component({
  selector: 'app-recent-list',
  template: `
    <div *ngIf="recentMovieList.length > 0" class="row">
        <app-card-list [title]="recentTitle" [movieList]="recentMovieList"></app-card-list>
    </div>
  `,
})
export class RecentListComponent {
  recentTitle = 'Recent';
  recentMovieList: Movie[] = [];

  constructor(private recentService: RecentService) {

    this.recentService.set$.subscribe(movies_to_set => {
      if (Array.isArray(movies_to_set)) {
        movies_to_set.forEach(movie_to_set => {
          const movie_index = this.recentMovieList.findIndex(movie => movie.id == movie_to_set.id);
          if (movie_index < 0)
            this.recentMovieList.push(movie_to_set);
          else
            this.recentMovieList[movie_index] = movie_to_set;
        });
      } else {
        console.error('movies_to_set is not an array:', movies_to_set);
      }
    });
  }

  async ngOnInit() {
    this.recentMovieList = await this.recentService.getRecent();
  }
}
