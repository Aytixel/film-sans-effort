import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { RecentService } from '../../service/recent/recent.service';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-recent-list',
  template: `
    <div *ngIf="recentMovieList.length > 0" class="row">
        <app-card-list [title]="recentTitle" [movieList]="recentMovieList"></app-card-list>
    </div>
  `,
})
export class RecentListComponent implements OnInit {
  recentTitle = 'Recent';
  recentMovieList: Movie[] = [];

  constructor(private recentService: RecentService, private authService: AuthService) {
    this.authService.state$.subscribe(async () => {
      this.recentMovieList = await this.recentService.getRecent();
    });
  }

  async ngOnInit() {
    this.recentMovieList = await this.recentService.getRecent();
  }
}
