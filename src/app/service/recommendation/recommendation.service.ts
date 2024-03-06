import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Movie } from '../../components/movie';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RecommendationService {

  constructor(private http: HttpClient, private authService: AuthService) { }
}
