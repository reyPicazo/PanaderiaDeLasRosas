import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanService } from '../../services/pan';
import { Pan } from '../../models/pan';

@Component({
  selector: 'app-productos',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: Pan[] = [];
  menuAbierto: number | null = null;
  mostrarModal: boolean = false;
  productoSeleccionado: Pan | null = null;
  nuevoProducto: string = '';
  nuevoPrecio: number | null = null;
  menuPosicion = { top: 0, left: 0 };
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  private toastTimer: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    public panService: PanService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getProductos();
  }

  toast(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.mostrarToast = false), 2800);
  }

  toggleMenu(id: number, event: MouseEvent) {
    const btn = event.target as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.menuPosicion = {
      top: rect.bottom + 4,
      left: rect.left - 100,
    };
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  abrirModalCrear() {
    this.productoSeleccionado = null;
    this.nuevoProducto = '';
    this.nuevoPrecio = null;
    this.mostrarModal = true;
  }

  mostrarEditar(producto: Pan) {
    this.menuAbierto = null;
    this.productoSeleccionado = { ...producto };
    this.nuevoProducto = producto.nombre;
    this.nuevoPrecio = producto.precio;
    this.mostrarModal = true;
  }

  borrarProducto(producto: Pan) {
    this.menuAbierto = null;
    this.panService.deletePan(producto.idPan).subscribe({
      next: () => this.getProductos(),
      error: (err) => this.toast(err.error?.error || 'No se pudo eliminar el producto'),
    });
  }

  editarProducto() {
    if (this.productoSeleccionado && this.nuevoProducto && this.nuevoPrecio !== null) {
      this.panService
        .updatePan(this.productoSeleccionado.idPan, {
          nombre: this.nuevoProducto,
          precio: this.nuevoPrecio,
        })
        .subscribe({
          next: () => {
            this.getProductos();
            this.mostrarModal = false;
          },
          error: (err) => this.toast(err.error?.error || 'No se pudo actualizar el producto'),
        });
    }
  }

  crearProducto() {
    if (this.nuevoProducto && this.nuevoPrecio !== null) {
      this.panService
        .createPan({ nombre: this.nuevoProducto, precio: this.nuevoPrecio })
        .subscribe({
          next: () => {
            this.getProductos();
            this.mostrarModal = false;
          },
          error: (err) => this.toast(err.error?.error || 'No se pudo crear el producto'),
        });
    }
  }

  getProductos() {
    this.panService.getPanes().subscribe({
      next: (data) => {
      this.productos = data;
      this.cdr.detectChanges();
    },

      error: (err) => this.toast('No se pudieron cargar los productos'),
    });
  }
}