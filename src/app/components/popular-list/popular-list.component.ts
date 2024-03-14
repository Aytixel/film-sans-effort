import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { PopularService } from '../../service/popular/popular.service';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-popular-list',
  template: `
    <div *ngIf="popularMovieList.length > 0" class="row">
        <app-card-carousel [title]="popularTitle" [movieList]="popularMovieList"></app-card-carousel>
    </div>
  `,
})
export class PopularListComponent implements OnInit {
  popularTitle = 'Popular';
  popularMovieList: Movie[] = [];

  constructor(private popularService: PopularService, private authService: AuthService) {
    this.authService.state$.subscribe(async () => {
      this.popularMovieList = await this.popularService.getPopular();
    });
  }

  async ngOnInit() {
    this.popularMovieList = await this.popularService.getPopular();
  }
}
