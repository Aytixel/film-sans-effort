import { TestBed } from '@angular/core/testing';

import { RecentService } from './recent.service';

describe('RecentService', () => {
  let service: RecentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
