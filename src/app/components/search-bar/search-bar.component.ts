import { Component, EventEmitter, Output } from '@angular/core';
import { MoviesService } from '../../service/movies.service';
import { Film } from '../film';
import { debounce } from 'lodash';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  @Output() onSearch = new EventEmitter<Film[]>();

  constructor(private moviesService: MoviesService) {
    this.searchMovies = debounce(this.searchMovies, 300) as any
  }

  async searchMovies(event: any) {
    // Récupération des id: number, title: string, image: string et favori: boolean ( false par défaut ) de chaque film

    this.onSearch.emit(
      (await this.moviesService.findMovies(event.target.value))
        .map((film: { id: number; title: string; poster_path: string; }) =>
          new Film(film.id, film.title, "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + film.poster_path, false))
    );
  }

}
