import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { RecommendationService } from '../../service/recommendation/recommendation.service';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-recommendation-list',
  template: `
    <div *ngIf="recommendationMovieList.length > 0" class="row">
        <app-card-list [title]="recommendationTitle" [movieList]="recommendationMovieList"></app-card-list>
    </div>
  `,
})
export class RecommendationListComponent {
  recommendationTitle = 'Recommendation';
  recommendationMovieList: Movie[] = [];
  
  constructor(private recommendationService: RecommendationService, private authService: AuthService) { 
      this.authService.state$.subscribe(async () => {
        this.recommendationMovieList = await this.recommendationService.getRecommendations();
      });

      this.recommendationService.set$.subscribe(movies_to_set => {
        if (Array.isArray(movies_to_set)) {
          movies_to_set.forEach(movie_to_set => {
            const movie_index = this.recommendationMovieList.findIndex(movie => movie.id == movie_to_set.id);
            if (movie_index < 0)
              this.recommendationMovieList.push(movie_to_set);
            else
              this.recommendationMovieList[movie_index] = movie_to_set;
          });
        }else{
          console.error('movies_to_set is not an array:', movies_to_set);
        }
      });
  }

  async ngOnInit() {
    this.recommendationMovieList = await this.recommendationService.getRecommendations();
  }
}
