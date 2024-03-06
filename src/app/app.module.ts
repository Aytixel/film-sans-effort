import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SearchBarModule } from './components/search-bar/search-bar.module';
import { AppComponent } from './app.component';
import { FavoriteListModule } from './components/favorite-list/favorite-list.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SearchBarModule,
    FavoriteListModule,
    RouterOutlet
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
