import { NgModule } from '@angular/core';
import { NgFor } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { CardListComponent } from './card-list.component';



@NgModule({
  declarations: [
    CardListComponent,
  ],
  imports: [
    CardComponent,
    NgFor
  ],
  exports: [
    CardListComponent,
  ]
})
export class CardListModule { }
