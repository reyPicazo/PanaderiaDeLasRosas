import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInventario } from './modal-inventario';
import { vi } from 'vitest';

describe('ModalInventario', () => {
  let component: ModalInventario;
  let fixture: ComponentFixture<ModalInventario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInventario],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInventario);
    component = fixture.componentInstance;
    await fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir onCerrar al llamar a cerrar()', () => {
    vi.spyOn(component.onCerrar, 'emit');
    component.cerrar();
    expect(component.onCerrar.emit).toHaveBeenCalled();
  });

  it('debería emitir la cantidad l confirmar()',()=>{
    vi.spyOn(component.onConfirmar, 'emit');
    component.cantidad = 5;
    component.confirmar();
    expect(component.onConfirmar.emit).toHaveBeenCalledWith(5);
  });

  it('debería resetear cantidad a 1 después de confirmar()',()=>{
    component.cantidad = 5;
    component.confirmar();
    expect(component.cantidad).toBe(1);
  });

  it('debería tener valores inicales correctos', () => {
    expect(component.titulo).toBe('');
    expect(component.visible).toBe(false);
    expect(component.cantidad).toBe(1);
  });
});
