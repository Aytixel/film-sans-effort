import { NgModule } from '@angular/core';
import { PopularListComponent } from './popular-list.component';
import { PopularService } from '../../service/popular/popular.service';
import { NgIf } from '@angular/common';
import { CardListModule } from '../card-list/card-list.module';
import { AuthService } from '../../service/auth/auth.service';


@NgModule({
  declarations: [
    PopularListComponent
  ],
  imports: [
    CardListModule,
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
