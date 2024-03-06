import { NgModule } from '@angular/core';
import { SearchBarComponent } from './search-bar.component';
import { CardListModule } from '../card-list/card-list.module';
import { FindMoviesService } from '../../service/find-movies/find-movies.service';
import { AuthService } from '../../service/auth/auth.service';
import { SearchListComponent } from './search-list/search-list.component';
import { NgIf } from '@angular/common';



@NgModule({
  declarations: [
    SearchBarComponent,
    SearchListComponent,
  ],
  imports: [
    CardListModule,
    NgIf
  ],
  providers: [
    AuthService,
    FindMoviesService
  ],
  exports: [
    SearchBarComponent,
    SearchListComponent,
  ]
})
export class SearchBarModule { }
