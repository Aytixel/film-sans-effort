import { NgModule } from '@angular/core';
import { PopularListComponent } from './popular-list.component';
import { PopularService } from '../../service/popular/popular.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { CardCarouselModule } from '../card-carousel/card-carousel.module';


@NgModule({
  declarations: [
    PopularListComponent
  ],
  imports: [
    CardCarouselModule,
    NgIf
  ],
  providers: [
    PopularService,
    AuthService,
  ],
  exports: [
    PopularListComponent
  ]
})
export class PopularListModule { }
