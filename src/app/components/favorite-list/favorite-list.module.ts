import { NgModule } from '@angular/core';
import { FavoriteListComponent } from './favorite-list.component';
import { FavoriteService } from '../../service/favorite/favorite.service';
import { NgIf } from '@angular/common';
import { CardListModule } from '../card-list/card-list.module';



@NgModule({
  declarations: [
    FavoriteListComponent
  ],
  imports: [
    CardListModule,
    NgIf
  ],
  providers: [
    FavoriteService
  ],
  exports: [
    FavoriteListComponent
  ]
})
export class FavoriteListModule { }
