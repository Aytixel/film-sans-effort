import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { FavoriteService } from '../../service/favorite/favorite.service';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-favorite-list',
  template: `
    <div *ngIf="favoriteMovieList.length" class="row">
        <app-card-list [title]="favoriteTitle" [movieList]="favoriteMovieList"></app-card-list>
    </div>
  `,
})
export class FavoriteListComponent implements OnInit {
  favoriteTitle = 'Favoris';
  favoriteMovieList: Movie[] = [];
  
  constructor(private favoriteService: FavoriteService, private authService: AuthService) {
    this.authService.state$.subscribe(async () => {
      
      this.favoriteMovieList = await this.favoriteService.getFavorites();
    });

    this.favoriteService.set$.subscribe(movie_to_set => {
      const movie_index = this.favoriteMovieList.findIndex(movie => movie.id == movie_to_set.id);

      if (movie_index < 0)
        this.favoriteMovieList.push(movie_to_set);
      else
        this.favoriteMovieList.splice(movie_index, 1);
    });
  }

  async ngOnInit() {
    this.favoriteMovieList = await this.favoriteService.getFavorites();
  }
}
