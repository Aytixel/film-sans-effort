import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { RecommendationService } from '../../service/recommendation/recommendation.service';

@Component({
  selector: 'app-recommendation-list',
  // 10 pour le nombre de recommendation à afficher
  template: `
    <div *ngIf="10" class="row">
        <app-card-list [title]="recommendationTitle" [movieList]="recommendationMovieList"></app-card-list>
    </div>
  `,
})
export class RecommendationListComponent {
  recommendationTitle = 'Recommendation';
  recommendationMovieList: Movie[] = [];
  
  constructor(private recommendationService: RecommendationService) { }

  async ngOnInit() {

  }
}
