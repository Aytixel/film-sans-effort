import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardListComponent } from './components/card-list/card-list.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Film } from './components/film';

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
  recommendationTitle = 'Recommandation';
  favoritesTitle = 'Favoris';

  searchFilmList: Film[] = [];

  setSearchFilmList(filmList: Film[]) {
    this.searchFilmList = filmList;
    console.log(this.searchFilmList);
  }
}
