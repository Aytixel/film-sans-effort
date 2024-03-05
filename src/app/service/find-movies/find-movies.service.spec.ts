import { TestBed } from '@angular/core/testing';

import { FindMoviesService } from './find-movies.service';

describe('MoviesService', () => {
  let service: FindMoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindMoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
