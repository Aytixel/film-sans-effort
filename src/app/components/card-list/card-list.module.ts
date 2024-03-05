import { NgModule } from '@angular/core';
import { NgFor } from '@angular/common';
import { CardListComponent } from './card-list.component';
import { CardModule } from '../card/card.module';



@NgModule({
  declarations: [
    CardListComponent,
  ],
  imports: [
    CardModule,
    NgFor
  ],
  exports: [
    CardListComponent,
  ]
})
export class CardListModule { }
