import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteOrdenes } from './reporte-ordenes';

describe('ReporteOrdenes', () => {
  let component: ReporteOrdenes;
  let fixture: ComponentFixture<ReporteOrdenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteOrdenes],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteOrdenes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
