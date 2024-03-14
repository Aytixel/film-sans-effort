import { NgModule } from '@angular/core';
import { RecommendationListComponent } from './recommendation-list.component';
import { RecommendationService } from '../../service/recommendation/recommendation.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { FavoriteService } from '../../service/favorite/favorite.service';
import { CardCarouselModule } from '../card-carousel/card-carousel.module';




@NgModule({
  declarations: [
    RecommendationListComponent
  ],
  imports: [
    CardCarouselModule,
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
