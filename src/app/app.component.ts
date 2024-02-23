import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardListComponent } from './components/card-list/card-list.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Movie } from './components/movie';
import { MoviesService } from './service/movies/movies.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SearchBarComponent,
    CardListComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  searchTitle = 'Recherche';
  movieList: Movie[] = [];

  constructor(private moviesService: MoviesService) {
    
  }

  async findMovies(query: string) {
    if (query.length) {
      this.movieList = (await this.moviesService.findMovies(query)).map(this.mapMovies);
    } else {
      this.movieList = [];
    }
  }

  async nextMovies() {
    if (this.movieList.length) {
      this.movieList = (await this.moviesService.findMovies()).map(this.mapMovies);
    }
  }

  private mapMovies(movie: { id: number; title: string; poster_path: string; }): Movie {
    return new Movie(movie.id, movie.title, movie.poster_path ? "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + movie.poster_path : "", false);
  }
}
