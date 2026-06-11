import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-clientes',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];
  menuAbierto: number | null = null;
  mostrarModal: boolean = false;
  clienteSeleccionado: Cliente | null = null;
  nuevoCliente: string = '';
  nuevaDireccion: string = '';
  nuevoTelefono: string = '';
  menuPosicion = { top: 0, left: 0 };
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  private toastTimer: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    public clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.getClientes();
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
    this.clienteSeleccionado = null;
    this.nuevoCliente = '';
    this.nuevaDireccion = '';
    this.nuevoTelefono = '';
    this.mostrarModal = true;
  }

  mostrarEditar(cliente: Cliente) {
    this.menuAbierto = null;
    this.clienteSeleccionado = { ...cliente };
    this.nuevoCliente = cliente.nombre;
    this.nuevaDireccion = cliente.direccion;
    this.nuevoTelefono = cliente.telefono;
    this.mostrarModal = true;
  }

  borrarCliente(cliente: Cliente) {
    this.menuAbierto = null;
    this.clienteService.deleteCliente(cliente.idCliente).subscribe({
      next: () => this.getClientes(),
      error: (err) => this.toast(err.error?.error || 'No se pudo eliminar el cliente'),
    });
  }

  editarCliente() {
    if (this.clienteSeleccionado && this.nuevoCliente && this.nuevaDireccion && this.nuevoTelefono) {
      this.clienteService
        .updateCliente(this.clienteSeleccionado.idCliente, {
          nombre: this.nuevoCliente,
          direccion: this.nuevaDireccion,
          telefono: this.nuevoTelefono,
        })
        .subscribe({
          next: () => {
            this.getClientes();
            this.mostrarModal = false;
          },
          error: (err) => this.toast(err.error?.error || 'No se pudo actualizar el cliente'),
        });
    }
  }

  crearCliente() {
    if (this.nuevoCliente && this.nuevaDireccion && this.nuevoTelefono) {
      this.clienteService
        .createCliente({
          nombre: this.nuevoCliente,
          direccion: this.nuevaDireccion,
          telefono: this.nuevoTelefono,
        })
        .subscribe({
          next: () => {
            this.getClientes();
            this.mostrarModal = false;
          },
          error: (err) => this.toast(err.error?.error || 'No se pudo crear el cliente'),
        });
    }
  }

  getClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => (this.clientes = data),
      error: () => this.toast('No se pudieron cargar los clientes'),
    });
  }
}