import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie } from '../movie';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() movie!: Movie;
  @Output() favori = new EventEmitter<Movie>();

  setFavori() {
    this.movie.favori = !this.movie.favori
    this.favori.emit(this.movie);
  }
}
