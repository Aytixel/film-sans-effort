import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchBarModule } from './components/search-bar/search-bar.module';
import { Movie } from './components/movie';
import { FindMoviesService } from './service/find-movies/find-movies.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SearchBarModule,
    RouterOutlet,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  searchTitle = 'Recherche';
  movieList: Movie[] = [];

  constructor(private moviesService: FindMoviesService) {
    
  }

  async findMovies(query: string) {
    if (query.length) {
      this.movieList = await this.moviesService.findMovies(query);
    } else {
      this.movieList = [];
    }
  }

  async nextMovies() {
    if (this.movieList.length) {
      this.movieList = await this.moviesService.findMovies();
    }
  }
}
