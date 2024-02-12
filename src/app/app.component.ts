import { Component } from '@angular/core';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { RouterOutlet } from '@angular/router';
import { CardListComponent } from './components/card-list/card-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TopBarComponent,
    CardListComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  recommendationTitle = 'Recommandation';
  favoritesTitle = 'Favoris';
}
