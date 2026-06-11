import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleados',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css',
})
export class Empleados implements OnInit {
  empleados: Empleado[] = [];
  menuAbierto: number | null = null;
  mostrarModal: boolean = false;
  empleadoSeleccionado: Empleado | null = null;
  nuevoEmpleado: string = '';
  nuevaDireccion: string = '';
  nuevoTelefono: string = '';
  menuPosicion = { top: 0, left: 0 };
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  private toastTimer: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    public empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {
    this.getEmpleados();
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
    this.empleadoSeleccionado = null;
    this.nuevoEmpleado = '';
    this.nuevaDireccion = '';
    this.nuevoTelefono = '';
    this.mostrarModal = true;
  }

  mostrarEditar(empleado: Empleado) {
    this.menuAbierto = null;
    this.empleadoSeleccionado = { ...empleado };
    this.nuevoEmpleado = empleado.nombre;
    this.nuevaDireccion = empleado.direccion;
    this.nuevoTelefono = empleado.telefono;
    this.mostrarModal = true;
  }

  borrarEmpleado(empleado: Empleado) {
    this.menuAbierto = null;
    this.empleadoService.deleteEmpleado(empleado.idEmpleado).subscribe({
      next: () => this.getEmpleados(),
      error: (err) => this.toast(err.error?.error || 'No se pudo eliminar el empleado'),
    });
  }

  editarEmpleado() {
    if (this.empleadoSeleccionado && this.nuevoEmpleado && this.nuevaDireccion && this.nuevoTelefono) {
      this.empleadoService
        .updateEmpleado(this.empleadoSeleccionado.idEmpleado, {
          nombre: this.nuevoEmpleado,
          direccion: this.nuevaDireccion,
          telefono: this.nuevoTelefono,
        })
        .subscribe({
          next: () => {
            this.getEmpleados();
            this.mostrarModal = false;
          },
          error: (err) => this.toast(err.error?.error || 'No se pudo actualizar el empleado'),
        });
    }
  }

  crearEmpleado() {
    if (this.nuevoEmpleado && this.nuevaDireccion && this.nuevoTelefono) {
      this.empleadoService
        .createEmpleado({
          nombre: this.nuevoEmpleado,
          direccion: this.nuevaDireccion,
          telefono: this.nuevoTelefono,
        })
        .subscribe({
          next: () => {
            this.getEmpleados();
            this.mostrarModal = false;
          },
          error: (err) => this.toast(err.error?.error || 'No se pudo crear el empleado'),
        });
    }
  }

  getEmpleados() {
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => (this.empleados = data),
      error: () => this.toast('No se pudieron cargar los empleados'),
    });
  }
}