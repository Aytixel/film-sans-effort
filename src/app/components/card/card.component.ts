import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Film } from '../film';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() film!: Film;
  @Output() favori = new EventEmitter<Film>();

  setFavori() {
    this.film.favori = !this.film.favori
    this.favori.emit(this.film);
  }
}
