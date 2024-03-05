import { NgModule } from '@angular/core';
import { CardComponent } from './card.component';
import { FavoriteService } from '../../service/favorite/favorite.service';
import { AuthService } from '../../service/auth/auth.service';



@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [],
  providers: [
    AuthService,
    FavoriteService
  ],
  exports: [
    CardComponent
  ]
})
export class CardModule { }
