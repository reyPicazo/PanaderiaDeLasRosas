import { TestBed } from '@angular/core/testing';

import { Pan } from './pan';

describe('Pan', () => {
  let service: Pan;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pan);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
