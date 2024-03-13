import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { RecommendationService } from '../../service/recommendation/recommendation.service';
import { AuthService } from '../../service/auth/auth.service';
import { FavoriteService } from '../../service/favorite/favorite.service';

@Component({
  selector: 'app-recommendation-list',
  template: `
    <div *ngIf="recommendationMovieList.length > 0" class="row">
        <app-card-list [title]="recommendationTitle" [movieList]="recommendationMovieList" (onEndReached)="nextRecommendation()"></app-card-list>
    </div>
  `,
})
export class RecommendationListComponent {
  recommendationTitle = 'Recommendation';
  recommendationMovieList: Movie[] = [];

  constructor(private recommendationService: RecommendationService, private authService: AuthService, private favoriteService: FavoriteService) {
    this.authService.state$.subscribe(async () => {
      this.recommendationMovieList = await this.recommendationService.getRecommendations();
    });

    this.favoriteService.set$.subscribe(async () => {
      this.recommendationMovieList = await this.recommendationService.getRecommendations();
    });
  }

  async ngOnInit() {
    this.recommendationMovieList = await this.recommendationService.getRecommendations();
  }

  async nextRecommendation() {
    this.recommendationMovieList = await this.recommendationService.getRecommendations(true);
  }
}
