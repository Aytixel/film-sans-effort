import { NgModule } from '@angular/core';
import { RecommendationListComponent } from './recommendation-list.component';
import { RecommendationService } from '../../service/recommendation/recommendation.service';
import { NgIf } from '@angular/common';
import { CardListModule } from '../card-list/card-list.module';




@NgModule({
  declarations: [
    RecommendationListComponent
  ],
  imports: [
    CardListModule,
    NgIf
  ],
  providers: [
    RecommendationService
  ],
  exports: [
    RecommendationListComponent
  ]
})
export class RecommendationListModule { }
