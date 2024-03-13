import { NgModule } from '@angular/core';
import { RecommendationListComponent } from './recommendation-list.component';
import { RecommendationService } from '../../service/recommendation/recommendation.service';
import { NgIf } from '@angular/common';
import { CardListModule } from '../card-list/card-list.module';
import { AuthService } from '../../service/auth/auth.service';
import { FavoriteService } from '../../service/favorite/favorite.service';




@NgModule({
  declarations: [
    RecommendationListComponent
  ],
  imports: [
    CardListModule,
    NgIf
  ],
  providers: [
    RecommendationService,
    AuthService,
    FavoriteService,
  ],
  exports: [
    RecommendationListComponent
  ]
})
export class RecommendationListModule { }
