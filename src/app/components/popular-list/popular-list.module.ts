import { NgModule } from '@angular/core';
import { PopularListComponent } from './popular-list.component';
import { PopularService } from '../../service/popular/popular.service';
import { NgIf } from '@angular/common';
import { CardListModule } from '../card-list/card-list.module';


@NgModule({
  declarations: [
    PopularListComponent
  ],
  imports: [
    CardListModule,
    NgIf
  ],
  providers: [
    PopularService
  ],
  exports: [
    PopularListComponent
  ]
})
export class PopularListModule { }
