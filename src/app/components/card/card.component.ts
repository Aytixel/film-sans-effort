import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  setFavorite() {
    this.movie.favorite = !this.movie.favorite
    this.favori.emit(this.movie);
  }
}
