import { Component, Input } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { Film } from '../film';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [NgFor, CardComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent {
  @Input() title: string = '';
  @Input() filmList: Film[] = [];
}
