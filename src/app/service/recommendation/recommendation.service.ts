import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class RecommendationService {
  public set$: EventEmitter<Movie[]> = new EventEmitter();
  
  private url: string = 'http://localhost:3080/';

  constructor(private http: HttpClient, private authService: AuthService, private favoriteService: FavoriteService) { 
    this.favoriteService.set$.subscribe(() => {
      this.updateRecommendations();
    });
  }

  async updateRecommendations() {
    const favorites = await this.favoriteService.getFavorites() || [];
    console.log("favorites", favorites);
    const genres = favorites.reduce((acc: { [x: string]: number; }, movie: { genres?: (string | number)[]; }) => {
      if (Array.isArray(movie.genres)) {
        movie.genres.forEach((genre: string | number) => {
          if (!acc[genre]) {
            acc[genre] = 1;
          } else {
            acc[genre]++;
          }
        });
      }
      return acc;
    }, {});

    const mostFrequentGenre = Object.keys(genres).length > 0 ? Object.keys(genres).reduce((a, b) => genres[a] > genres[b] ? a : b) : null;
    console.log(mostFrequentGenre);
    
    if (mostFrequentGenre !== null) {
      const genreMoviesResponse: any = await firstValueFrom(this.http.get(`${this.url}movie/genre/${mostFrequentGenre}`));
      const genreMovies: Movie[] = genreMoviesResponse.map(Movie.mapMovies);
      console.log("genreMovies", genreMovies);
      this.set$.emit(genreMovies);
    } else {
      this.set$.emit([]);
    }
  }

  async getRecommendations(): Promise<Movie[]> {
    if (!this.authService.isLoggedIn()) {
      return Promise.resolve([]);
    }
  
    const userId = this.authService.getUserId();
    const favoritesResponse: any = await firstValueFrom(this.http.get(`${this.url}movie/favorite?user_id=${userId}`));
    console.log("favoritesResponse", favoritesResponse);
  
    const favorites: Movie[] = await Promise.all(favoritesResponse.map(async (rec: any) => {
    const movieDetailsResponse: any = await firstValueFrom(this.http.get(`${this.url}movie/${rec.id}`));
    const genres = movieDetailsResponse.genre.map((g: { id: number; name: string; }) => g.id);
    return new Movie(rec.id, rec.title, rec.poster, rec.favorite, genres);
    }));
    console.log("favorites", favorites);
    
    const genres = favorites.reduce((acc: { [x: string]: number; }, movie: { genres?: (string | number)[]; }) => {
      if (Array.isArray(movie.genres)) {
        movie.genres.forEach((genre: string | number) => {
          if (!acc[genre]) {
            acc[genre] = 1;
          } else {
            acc[genre]++;
          }
        });
      }
      return acc;
    }, {});
    console.log("genres", genres);
  
    const mostFrequentGenre = Object.keys(genres).length > 0 ? Object.keys(genres).reduce((a, b) => genres[a] > genres[b] ? a : b) : null;
    console.log(mostFrequentGenre);

    if (mostFrequentGenre !== null) {
      const genreMoviesResponse: any = await firstValueFrom(this.http.get(`${this.url}movie/genre/${mostFrequentGenre}`));
      const genreMovies: Movie[] = genreMoviesResponse.map(Movie.mapMovies);
      console.log("genreMovies", genreMovies);
      return genreMovies;
    } else {
      return [];
    }
    
  }
}
