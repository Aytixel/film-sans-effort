import { Component } from '@angular/core';
import { debounce } from 'lodash';
import { FindMoviesService } from '../../service/find-movies/find-movies.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  constructor(private findMoviesService: FindMoviesService) {
    this.search = debounce(this.search, 300) as any;
  }

  search(event: any) {
    if (event.target.value.length)
      this.findMoviesService.findMovies(event.target.value);
    else
      this.findMoviesService.update$.emit([]);
  }
}
