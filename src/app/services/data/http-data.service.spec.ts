import { TestBed } from '@angular/core/testing';

import { HttpDataService } from './http-data.service';

describe('DataService', () => {
  let service: HttpDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
