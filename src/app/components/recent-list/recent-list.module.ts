import { NgModule } from '@angular/core';
import { RecentListComponent } from './recent-list.component';
import { RecentService } from '../../service/recent/recent.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { CardCarouselModule } from '../card-carousel/card-carousel.module';


@NgModule({
  declarations: [
    RecentListComponent
  ],
  imports: [
    CardCarouselModule,
    NgIf
  ],
  providers: [
    RecentService,
    AuthService,
  ],
  exports: [
    RecentListComponent
  ]
})
export class RecentListModule { }