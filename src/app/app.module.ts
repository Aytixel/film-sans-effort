import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { SearchBarModule } from './components/search-bar/search-bar.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FavoriteService } from './service/favorite/favorite.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SearchBarModule,
    RouterOutlet,
    NgIf
  ],
  providers: [
    FavoriteService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
