import { TestBed } from '@angular/core/testing';

import { WindDataService } from './wind-data.service';

describe('WindDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WindDataService = TestBed.get(WindDataService);
    expect(service).toBeTruthy();
  });
});
