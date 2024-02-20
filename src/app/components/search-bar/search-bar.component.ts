import { Component } from '@angular/core';
import { MoviesService } from '../../service/movies.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  searchRes: any;

  constructor(private _moviesService: MoviesService) { }

  searchMovies(event: any) {
    this._moviesService.searchMovies(event.target.value).subscribe(res => {
      this.searchRes = res.results;
    });
  }

}
