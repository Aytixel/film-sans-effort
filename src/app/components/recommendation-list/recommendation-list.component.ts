import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { RecommendationService } from '../../service/recommendation/recommendation.service';
import { AuthService } from '../../service/auth/auth.service';
import { FavoriteService } from '../../service/favorite/favorite.service';

@Component({
  selector: 'app-recommendation-list',
  templateUrl: './recommendation-list.component.html',
})
export class RecommendationListComponent implements OnInit {
  recommendationTitle = 'Recommendation';
  recommendationMovieList: Movie[] = [];

  constructor(private recommendationService: RecommendationService, private authService: AuthService, private favoriteService: FavoriteService) {
    this.authService.state$.subscribe(async () => {
      this.recommendationMovieList = await this.recommendationService.getRecommendations();
    });

    this.favoriteService.set$.subscribe(() => {
      // ajout d'un délais pour laisser le temps aux favoris de se mettre à jour sur le serveur
      requestAnimationFrame(async () => {
        this.recommendationMovieList = await this.recommendationService.getRecommendations();
      });
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  async ngOnInit() {
    this.recommendationMovieList = await this.recommendationService.getRecommendations();
  }

  async nextRecommendation() {
    this.recommendationMovieList = await this.recommendationService.getRecommendations(true);
  }
}
