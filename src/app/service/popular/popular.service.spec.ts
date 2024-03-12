import { TestBed } from '@angular/core/testing';

import { PopularService } from './popular.service';

describe('PopularService', () => {
  let service: PopularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
