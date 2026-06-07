import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

import { CrearOrden } from './crear-orden';
import { OrdenService } from '../../services/orden';
import { AuthService } from '../../services/auth';
import { InventarioSQ } from '../../services/inventario-sq';

describe('CrearOrden', () => {

  let component: CrearOrden;
  let fixture: ComponentFixture<CrearOrden>;
  let router: Router;

  const mockOrdenService = {
    crearOrden: vi.fn(),
    getordenEditar: vi.fn().mockReturnValue(null),
    getOrdenById: vi.fn(),
    setOrden: vi.fn(),
    deleteOrdenEditar: vi.fn()
  };

  const mockInventarioService = {
    getQuesadillas: vi.fn().mockReturnValue(5),
    getNugets: vi.fn().mockReturnValue(3),
    reducirQuesadillas: vi.fn(),
    reducirNugets: vi.fn()
  };

  const mockAuthService = {
    login: vi.fn(),
    getUser: vi.fn().mockReturnValue('admin'),
  };

  

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CrearOrden, RouterTestingModule],
      providers: [
        { provide: OrdenService, useValue: mockOrdenService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: InventarioSQ, useValue: mockInventarioService }
      ]
    }).compileComponents();
    router=TestBed.inject(Router);
    vi.spyOn(router, 'navigate')
    fixture = TestBed.createComponent(CrearOrden);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar formulario de quesadillas', () => {

    component.agregarQuesadilla();

    expect(component.mostrarFormQuesadillas).toBe(true);
  });

  it('debería mostrar formulario de nuggets', () => {

    component.agregarNuggets();

    expect(component.mostrarFormNuggets).toBe(true);
  });

  it('debería confirmar quesadillas correctamente', () => {

    component.cantidadQ = 2;

    component.confirmarQuesadilla();

    expect(component.quesadillas).toBe(2);
    expect(component.mostrarFormQuesadillas).toBe(false);
  });

  it('debería confirmar nuggets correctamente', () => {

    component.cantidadN = 3;

    component.confirmarNuggets();

    expect(component.nuggets).toBe(3);
    expect(component.mostrarFormNuggets).toBe(false);
  });

  it('debería mostrar error si no se agregan productos', () => {

    component.quesadillas = 0;
    component.nuggets = 0;

    component.crearOrden();

    expect(component.mostrarError).toBe(true);
  });

  it('debería crear una orden válida y navegar a home', () => {

    component.quesadillas = 2;
    component.nuggets = 3;

    mockOrdenService.getOrdenById.mockReturnValue(undefined);

    component.crearOrden();

    expect(mockOrdenService.crearOrden).toHaveBeenCalledWith(2, 3);

    expect(router.navigate)
      .toHaveBeenCalledWith(['/home']);
  });

  it('debería cerrar el mensaje de error', () => {

    component.mostrarError = true;

    component.cerrarError();

    expect(component.mostrarError).toBe(false);
  });

  it('debería mostrar confirmación al cancelar', () => {

    component.cancelar();

    expect(component.mostrarConfirmacion).toBe(true);
  });

  it('debería navegar al home si login es correcto', () => {

    component.admin = 'admin';
    component.password = '1234';

    mockAuthService.login.mockReturnValue(true);

    component.confirmarCancelar();

    expect(router.navigate)
      .toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar mensaje de error si login falla', () => {

    component.admin = 'admin';
    component.password = 'wrongpassword';

    mockAuthService.login.mockReturnValue(false);

    component.confirmarCancelar();

    expect(component.errorMSG)
      .toBe('Credenciales incorrectas. Intente de nuevo.');
  });

  it('debería limitar cantidadQ al máximo del inventario', () => {
  mockInventarioService.getQuesadillas.mockReturnValue(5);
  component.cantidadQ = 10;
  component.validarQuesadillas();
  expect(component.cantidadQ).toBe(5);
  expect(component.mostrarErrorQ).toBe(true);
});

it('debería limitar cantidadN al máximo del inventario', () => {
  mockInventarioService.getNugets.mockReturnValue(3);
  component.cantidadN = 8;
  component.validarNuggets();
  expect(component.cantidadN).toBe(3);
  expect(component.mostrarErrorN).toBe(true);
});

it('debería cerrar el modal de error de quesadillas', () => {
  component.mostrarErrorQ = true;
  component.cerrarErrorQ();
  expect(component.mostrarErrorQ).toBe(false);
});

it('debería cerrar el modal de error de nuggets', () => {
  component.mostrarErrorN = true;
  component.cerrarErrorN();
  expect(component.mostrarErrorN).toBe(false);
});

it('no debería mostrar error si cantidadQ está dentro del inventario', () => {
  mockInventarioService.getQuesadillas.mockReturnValue(10);
  component.cantidadQ = 5;
  component.validarQuesadillas();
  expect(component.mostrarErrorQ).toBe(false);
  expect(component.cantidadQ).toBe(5);
});



});