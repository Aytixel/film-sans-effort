import { Component, OnInit } from '@angular/core';
import { Movie } from './components/movie';
import { FindMoviesService } from './service/find-movies/find-movies.service';
import { FavoriteService } from './service/favorite/favorite.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  searchTitle = 'Recherche';
  searchMovieList: Movie[] = [];
  favoriteTitle = 'Favoris';
  favoriteMovieList: Movie[] = [];

  constructor(private findMoviesService: FindMoviesService, private favoriteService: FavoriteService) { }

  async ngOnInit() {
    this.favoriteMovieList = await this.favoriteService.getFavorites();

    this.favoriteService.set$.subscribe(movie_to_set => {
      const movie_index = this.favoriteMovieList.findIndex(movie => movie.id == movie_to_set.id);

      if (movie_index < 0)
        this.favoriteMovieList.push(movie_to_set);
      else
        this.favoriteMovieList.splice(movie_index, 1);
    });
  }

  async findMovies(query: string) {
    if (query.length) {
      this.searchMovieList = await this.findMoviesService.findMovies(query);
    } else {
      this.searchMovieList = [];
    }
  }

  async nextMovies() {
    if (this.searchMovieList.length) {
      this.searchMovieList = await this.findMoviesService.findMovies();
    }
  }
}
