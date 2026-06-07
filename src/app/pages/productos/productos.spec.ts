import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Productos } from './productos';
import { InventarioSQ } from '../../services/inventario-sq';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

const mockInventarioService = {
  getProductos: () => [
    { id: 1, nombre: 'Quesadilla', precio: 50, cantidad: 10 },
    { id: 2, nombre: 'Nugget', precio: 30, cantidad: 20 }
  ],
  agregarProducto: vi.fn(),
  deleteProducto: vi.fn(),
  actualizarProducto: vi.fn(),
};

const mockAuthService = {
  getUser: () => ({ username: 'admin' }),
  logout: vi.fn()
};

describe('Productos', () => {
  let component: Productos;
  let fixture: ComponentFixture<Productos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productos, CommonModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: InventarioSQ, useValue: mockInventarioService },
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Productos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar productos al iniciar', () => {
    expect(component.productos.length).toBe(2);
  });

  it('debe abrir modal de crear limpiando los campos', () => {
    component.nuevoProducto = 'algo';
    component.nuevoPrecio = 99;
    component.abrirModalCrear();
    expect(component.mostrarModal).toBe(true);
    expect(component.productoSeleccionado).toBeNull();
    expect(component.nuevoProducto).toBe('');
    expect(component.nuevoPrecio).toBeNull();
    expect(component.nuevaCantidad).toBeNull();
  });

  it('debe abrir modal de editar con producto seleccionado', () => {
    const producto = { id: 1, nombre: 'Quesadilla', precio: 50, cantidad: 10 };
    component.mostrarEditar(producto);
    expect(component.mostrarModal).toBe(true);
    expect(component.productoSeleccionado).toEqual(producto);
  });

  it('debe crear un producto y cerrar el modal', () => {
    component.nuevoProducto = 'Taco';
    component.nuevoPrecio = 25;
    component.nuevaCantidad = 5;
    component.crearProducto();
    expect(mockInventarioService.agregarProducto).toHaveBeenCalledWith('Taco', 25, 5);
    expect(component.mostrarModal).toBe(false);
  });

  it('no debe crear producto si faltan campos', () => {
    mockInventarioService.agregarProducto.mockClear();
    component.nuevoProducto = '';
    component.nuevoPrecio = null;
    component.nuevaCantidad = null;
    component.crearProducto();
    expect(mockInventarioService.agregarProducto).not.toHaveBeenCalled();
  });

  it('debe borrar un producto', () => {
    const producto = { id: 1, nombre: 'Quesadilla', precio: 50, cantidad: 10 };
    component.borrarProducto(producto);
    expect(mockInventarioService.deleteProducto).toHaveBeenCalledWith(1);
  });

  it('debe editar un producto si todos los campos son válidos', () => {
    component.productoSeleccionado = { id: 1, nombre: 'Quesadilla', precio: 60, cantidad: 15 };
    component.editarProducto();
    expect(mockInventarioService.actualizarProducto).toHaveBeenCalledWith(1, { precio: 60, cantidad: 15 });
    expect(component.mostrarModal).toBe(false);
  });

  it('no debe editar si faltan campos en productoSeleccionado', () => {
    mockInventarioService.actualizarProducto.mockClear();
    component.productoSeleccionado = { id: 1, nombre: '', precio: null, cantidad: null };
    component.editarProducto();
    expect(mockInventarioService.actualizarProducto).not.toHaveBeenCalled();
  });

  it('debe alternar el menú al hacer toggleMenu', () => {
    const mockEvent = { target: { getBoundingClientRect: () => ({ bottom: 100, left: 200 }) } } as any;
    component.toggleMenu(1, mockEvent);
    expect(component.menuAbierto).toBe(1);
    component.toggleMenu(1, mockEvent);
    expect(component.menuAbierto).toBeNull();
  });

  it('debe cerrar el menú anterior al abrir uno nuevo', () => {
    const mockEvent = { target: { getBoundingClientRect: () => ({ bottom: 100, left: 200 }) } } as any;
    component.toggleMenu(1, mockEvent);
    component.toggleMenu(2, mockEvent);
    expect(component.menuAbierto).toBe(2);
  });
});