import { TestBed } from '@angular/core/testing';

import { QuesaurillasDb } from './quesaurillas-db';

describe('QuesaurillasDb', () => {
  let service: QuesaurillasDb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuesaurillasDb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
