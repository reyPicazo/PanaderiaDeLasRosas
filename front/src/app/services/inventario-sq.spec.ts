import { TestBed } from '@angular/core/testing';

import { InventarioSQ } from './inventario-sq';

describe('InventarioSQ', () => {
  let service: InventarioSQ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioSQ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
