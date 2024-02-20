import { Component, Input } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { Film } from '../film';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [NgFor, CardComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent {
  @Input() title: string = '';
  @Input() filmList: Film[] = [
    new Film(0, 'Wonka', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/aKAnL3sr5iz5SsOs89vS2k1XrKO.jpg', false)
  ];
}
