import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SearchBarModule } from './components/search-bar/search-bar.module';
import { AppComponent } from './app.component';
import { FavoriteListModule } from './components/favorite-list/favorite-list.module';
import { RecommendationListModule } from "./components/recommendation-list/recommendation-list.module";



@NgModule({
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        SearchBarModule,
        FavoriteListModule,
        RouterOutlet,
        RecommendationListModule
    ]
})
export class AppModule { }
