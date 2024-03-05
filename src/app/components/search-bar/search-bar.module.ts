import { NgModule } from '@angular/core';
import { SearchBarComponent } from './search-bar.component';
import { CardListModule } from '../card-list/card-list.module';
import { FindMoviesService } from '../../service/find-movies/find-movies.service';
import { AuthService } from '../../service/auth/auth.service';



@NgModule({
  declarations: [
    SearchBarComponent
  ],
  imports: [
    CardListModule
  ],
  providers: [
    AuthService,
    FindMoviesService
  ],
  exports: [
    SearchBarComponent,
    CardListModule
  ]
})
export class SearchBarModule { }
