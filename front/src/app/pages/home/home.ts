import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';
import { CrearOrden } from '../crear-orden/crear-orden';
import { FormsModule } from '@angular/forms';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden';


@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  ordenes: Orden[] = [];
  ordenActual: Orden | undefined;
  mostrarPagar: boolean = false;
  mostrarPagoExitoso: boolean = false;
  mostrarCancelar: boolean = false;
  pagoCliente: number | undefined;
  cambio: number = 0;

  constructor(
    private auth: AuthService,
    private router: Router,
    private ordenService: OrdenService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes(){
    const empleado = this.auth.getEmpleado();
    if(!empleado){
      this.router.navigate(['/login']);
      return;
    }

    this.ordenService.getOrdenes(0,empleado!.idEmpleado).subscribe({
      next:(data)=>{
        this.ordenes=data;
        if(data.length>0){
          this.seleccionarOrden(data[0]);
        }else{
          this.ordenActual=undefined;
        }
        
        this.cdr.detectChanges();
      },
      error:()=>console.error("Error al cargar ordenes")
    })
  }

  calcularTotal(orden: Orden): number {
    if(!orden.detalles) return 0;
    return orden.detalles.reduce((total, detalle) => total + detalle.cantidad * detalle.pan.precio, 0);
  }

  seleccionarOrden(orden: Orden) {
    this.ordenService.getOrdenById(orden.idOrden).subscribe({
      next:(data)=>{
        this.ordenActual=data;
        this.cdr.detectChanges();
      },
      error: ()=>console.error("Error al cargar detalles de la orden")
    });
  }

  editarOrden(orden: Orden) {
    this.ordenService.getOrdenById(orden.idOrden).subscribe({
      next:(ordenCompleta)=>{
        this.ordenService.setOrdenEditar(ordenCompleta);
        this.router.navigate(['/crear-orden']);
      },
      error:()=>console.error('Error al cargar la orden al editar')
    })
  }



  confirmarCancelar(){
    this.mostrarCancelar=true;
    
  }

  cancelarOrden(){
    if(!this.ordenActual) return;
    this.ordenService.actualizarEstado(this.ordenActual.idOrden, -1).subscribe({
      next:()=>{
        this.mostrarCancelar=false;
        this.cargarOrdenes();
      },
      error: ()=> console.error("Error al cancelar la orden")
    });
  }

  pagarOrden(){
    if(!this.ordenActual) return;

    if(!this.ordenActual.detalles){
      this.ordenService.getOrdenById(this.ordenActual.idOrden).subscribe({
        next:(orden)=>{
          this.ordenActual=orden;
          this.mostrarPagar=true;
          this.cdr.detectChanges();
        }
      });
    }else{
      this.mostrarPagar=true;
    }
  }

  calcularCambio(){
    if(this.ordenActual&&this.pagoCliente){
      this.cambio=this.pagoCliente-this.calcularTotal(this.ordenActual);
    }
  }

  funcionCerrar(){
    this.mostrarPagar=false;
    this.pagoCliente=undefined;
    this.cambio=0;
  }

  funcionPagar(){
    if(!this.ordenActual || this.pagoCliente === undefined || this.cambio < 0) return;

    this.ordenService.actualizarEstado(this.ordenActual.idOrden, 1).subscribe({
      next:()=>{
        this.mostrarPagar=false;
        this.mostrarPagoExitoso=true;
        this.pagoCliente=undefined;
        this.cambio=0;
        this.cargarOrdenes();
      },
      error:()=>console.error("Error al procesar el pago")
    });
  }

  cerrarPagoExitoso() {
    this.mostrarPagoExitoso = false;
  }

  crearOrden(){
    this.router.navigate(['/crear-orden']);
  }

  

  

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
