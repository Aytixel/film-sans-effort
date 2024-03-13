import { Component, Input } from '@angular/core';
import { Movie } from '../movie';
import { FavoriteService } from '../../service/favorite/favorite.service';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() movie!: Movie;

  constructor(private favoriteService: FavoriteService, private authService: AuthService) {
    this.favoriteService.set$.subscribe(movie_to_set => {
      if (movie_to_set.id == this.movie.id)
        this.movie.favorite = movie_to_set.favorite;
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  setFavorite() {
    this.movie.favorite = !this.movie.favorite;
    this.movie.favorite = this.favoriteService.setFavorite(this.movie) && this.movie.favorite;
  }
}
