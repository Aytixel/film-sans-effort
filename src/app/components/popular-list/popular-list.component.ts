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

  constructor(private popularService: PopularService) { }

  async ngOnInit() {
    this.popularMovieList = await this.popularService.getPopular();
  }
}
