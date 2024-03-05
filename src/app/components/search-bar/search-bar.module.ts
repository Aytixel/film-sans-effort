import { NgModule } from '@angular/core';
import { SearchBarComponent } from './search-bar.component';
import { CardListModule } from '../card-list/card-list.module';



@NgModule({
  declarations: [
    SearchBarComponent
  ],
  imports: [
    CardListModule
  ],
  exports: [
    SearchBarComponent,
    CardListModule
  ]
})
export class SearchBarModule { }
