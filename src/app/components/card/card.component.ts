import { Component, Input } from '@angular/core';
import { Movie } from '../movie';
import { FavoriteService } from '../../service/favorite/favorite.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() movie!: Movie;

  constructor(private favoriteService: FavoriteService) { }

  setFavorite() {
    this.movie.favorite = !this.movie.favorite;
    this.movie.favorite = this.favoriteService.setFavorite(this.movie) && this.movie.favorite;
  }
}
