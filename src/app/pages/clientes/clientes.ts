import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { InventarioSQ } from '../../services/inventario-sq';

@Component({
  selector: 'app-clientes',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {

  clientes:any[] = [];
  menuAbierto:number | null = null;
  mostrarModal:boolean = false;
  clienteSeleccionado:any | null = null;
  nuevoCliente:string = '';
  nuevaCantidad:number | null = null;
  menuPosicion = { top: 0, left: 0 };
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  private toastTimer: any;

  constructor(private auth: AuthService, private router: Router, public inventarioService: InventarioSQ) {}
  ngOnInit(): void {
  }
  toast(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.mostrarToast = false, 2800);
  }

 toggleMenu(id: number, event: MouseEvent) {
  const btn = event.target as HTMLElement;
  const rect = btn.getBoundingClientRect();
  this.menuPosicion = {
    top: rect.bottom + 4,
    left: rect.left - 100
  };
  this.menuAbierto = this.menuAbierto === id ? null : id;
}

  abrirModalCrear(){
    this.clienteSeleccionado = null;
    this.nuevoCliente = '';
    this.mostrarModal = true;
  }

  mostrarEditar(producto:any){
    this.menuAbierto = null;
    
    this.clienteSeleccionado = { ...producto };
    this.nuevoCliente = producto.producto;  
    this.mostrarModal = true;
  }
}

