import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Home } from './home';
import { AuthService } from '../../services/auth';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden';

describe('Home', () => {

  let component: Home;
  let fixture: ComponentFixture<Home>;
  let router: Router;

  const mockOrdenes: Orden[] = [
  {
    id: 1,
    quesadillas: 2,
    nuggets: 1,
    precioQ: 100,
    precioN: 100,
    total: 300
  },
  {
    id: 2,
    quesadillas: 1,
    nuggets: 3,
    precioQ: 100,
    precioN: 100,
    total: 400
  }
];

  const mockOrdenService = {

    getOrdenes: vi.fn().mockReturnValue(mockOrdenes),

    getOrdenActual$: vi.fn().mockReturnValue(
      of(mockOrdenes[0])
    ),

    saveOrdenEditar: vi.fn(),

    eliminarOrden: vi.fn(),

    pushOrdenPagada: vi.fn()
  };

  const mockAuthService = {

    login: vi.fn(),

    logout: vi.fn(),

    getUser: vi.fn().mockReturnValue('admin')
  };

  beforeEach(async () => {

    vi.clearAllMocks();
    await TestBed.configureTestingModule({

      imports: [
        Home,
        RouterTestingModule
      ],

      providers: [
        { provide: OrdenService, useValue: mockOrdenService },
        { provide: AuthService, useValue: mockAuthService }
      ]

    }).compileComponents();

    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate');

    vi.spyOn(window, 'alert')
      .mockImplementation(() => {});

    fixture = TestBed.createComponent(Home);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('debería cargar órdenes al iniciar', () => {

    expect(component.ordenes.length)
      .toBe(2);
  });

  it('debería seleccionar una orden', () => {

    const orden = mockOrdenes[0];

    component.seleccionarOrden(orden);

    expect(component.ordenActual)
      .toBe(orden);
  });

  it('debería navegar a crear-orden al editar', () => {

    const orden = mockOrdenes[0];

    component.ordenActual = orden;

    component.editarOrden(orden);

    expect(mockOrdenService.saveOrdenEditar)
      .toHaveBeenCalledWith(orden.id);

    expect(router.navigate)
      .toHaveBeenCalledWith(['/crear-orden']);
  });

  it('debería mostrar confirmación al eliminar', () => {

    component.confirmareliminarOrden();

    expect(component.cancelar)
      .toBe(true);
  });

  it('debería eliminar orden si login es válido', () => {

    const orden = mockOrdenes[0];

    component.ordenActual = orden;

    component.admin = 'admin';
    component.password = '1234';

    mockAuthService.login.mockReturnValue(true);

    component.eliminarOrden(orden);

    expect(mockOrdenService.eliminarOrden)
      .toHaveBeenCalledWith(orden.id);
  });

  it('no debería eliminar orden si login falla', () => {

    const orden = mockOrdenes[0];

    component.ordenActual = orden;

    mockAuthService.login.mockReturnValue(false);

    component.eliminarOrden(orden);

    expect(mockOrdenService.eliminarOrden)
      .not.toHaveBeenCalled();
  });

  it('debería mostrar modal de pago', () => {

    component.pagarOrden();

    expect(component.mostrarPagar)
      .toBe(true);
  });

  it('debería calcular cambio correctamente', () => {

    component.ordenActual = mockOrdenes[0];

    component.pagoCliente = 500;

    component.calcularCambio();

    expect(component.cambio)
      .toBe(200);
  });

  it('debería cerrar modal de pago', () => {

    component.mostrarPagar = true;
    component.pagoCliente = 500;
    component.cambio = 100;

    component.funcionCerrar();

    expect(component.mostrarPagar)
      .toBe(false);

    expect(component.pagoCliente)
      .toBeUndefined();

    expect(component.cambio)
      .toBe(0);
  });



  it('debería navegar a crear-orden', () => {

    component.crearOrden();

    expect(router.navigate)
      .toHaveBeenCalledWith(['/crear-orden']);
  });

  it('debería cerrar sesión y navegar al login', () => {

    component.logout();

    expect(mockAuthService.logout)
      .toHaveBeenCalled();

    expect(router.navigate)
      .toHaveBeenCalledWith(['/login']);
  });

  it('debería desuscribirse al destruir componente', () => {

    const unsubscribeSpy = vi.spyOn(
      component['sub']!,
      'unsubscribe'
    );

    component.ngOnDestroy();

    expect(unsubscribeSpy)
      .toHaveBeenCalled();
  });

});