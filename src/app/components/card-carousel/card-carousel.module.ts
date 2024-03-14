import { NgModule } from '@angular/core';
import { NgFor } from '@angular/common';
import { CardCarouselComponent } from './card-carousel.component';
import { CardModule } from '../card/card.module';



@NgModule({
  declarations: [
    CardCarouselComponent
  ],
  imports: [
    CardModule,
    NgFor,
  ],
  exports: [
    CardCarouselComponent
  ]
})
export class CardCarouselModule { }
