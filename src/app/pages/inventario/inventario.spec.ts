import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import{vi} from 'vitest';
import { Inventario } from './inventario';
import { InventarioSQ } from '../../services/inventario-sq';

describe('Inventario', () => {
  let component: Inventario;
  let fixture: ComponentFixture<Inventario>;

  const mockInventarioService = {
    getQuesadillas: vi.fn().mockReturnValue(10),
    getNugets: vi.fn().mockReturnValue(5),
    setQuesadillas: vi.fn(),
    setNugets: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inventario],
      providers: [
        provideRouter([]),
        { provide: InventarioSQ, useValue: mockInventarioService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Inventario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar cantidades del inventario al iniciar', () => {
    expect(component.cantQuesadillas).toBe(10);
    expect(component.cantNugets).toBe(5);
  });


  it('debería abrir modal con producto Quesadilla', () => {
    component.abrirModal('Quesadilla');
    expect(component.mostrarModal).toBe(true);
    expect(component.productoSeleccionado).toBe('Quesadilla');
  });

  it('debería abrir modal con producto Nuget', () => {
    component.abrirModal('Nuget');
    expect(component.mostrarModal).toBe(true);
    expect(component.productoSeleccionado).toBe('Nuget');
  });


  it('debería sumar cantidad a quesadillas', () => {
    component.cantQuesadillas = 10;
    component.productoSeleccionado = 'Quesadilla';
    component.procesarCantidad(5);
    expect(component.cantQuesadillas).toBe(15);
    expect(mockInventarioService.setQuesadillas).toHaveBeenCalledWith(15);
    expect(component.mostrarModal).toBe(false);
  });


  it('debería sumar cantidad a nuggets', () => {
    component.cantNugets = 5;
    component.productoSeleccionado = 'Nuget';
    component.procesarCantidad(3);
    expect(component.cantNugets).toBe(8);
    expect(mockInventarioService.setNugets).toHaveBeenCalledWith(8);
    expect(component.mostrarModal).toBe(false);
  });


  it('debería cerrar el modal', () => {
    component.mostrarModal = true;
    component.mostrarModal = false;
    expect(component.mostrarModal).toBe(false);
  });
});
