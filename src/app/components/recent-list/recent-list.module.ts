import { NgModule } from '@angular/core';
import { RecentListComponent } from './recent-list.component';
import { RecentService } from '../../service/recent/recent.service';
import { NgIf } from '@angular/common';
import { CardListModule } from '../card-list/card-list.module';


@NgModule({
  declarations: [
    RecentListComponent
  ],
  imports: [
    CardListModule,
    NgIf
  ],
  providers: [
    RecentService
  ],
  exports: [
    RecentListComponent
  ]
})
export class RecentListModule { }