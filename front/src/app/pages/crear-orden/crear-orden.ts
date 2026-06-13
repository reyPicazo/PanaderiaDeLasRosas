import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Orden } from '../../models/orden.model';
import { OrdenService } from '../../services/orden.service';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { PanService } from '../../services/pan';
import { Pan } from '../../models/pan';
import {Cliente} from '../../models/cliente';
import { ClienteService } from '../../services/cliente';

@Component({
  selector: 'app-crear-orden',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './crear-orden.html',
  styleUrl: './crear-orden.css',
})
export class CrearOrden implements OnInit {

panes: Pan[] = [];
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  mostrarModalCliente: boolean = false;
  mensajeToast: string = '';
  mostrarToast: boolean = false;
  private toastTimer: any;


  constructor(private ordenService: OrdenService, private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef, private panService: PanService, private clienteService: ClienteService) {}
    
  

  ngOnInit(){
    
    this.getProductos();
    this.getClientes();
  }


  toast(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.mostrarToast = false), 2800);
  }


  getProductos(): void {
    this.panService.getPanes().subscribe({
      next: (data) => {
        (this.panes = data);
        this.cdr.detectChanges();
      },
      error: (err) => this.toast('No se pudieron cargar los productos'),
    });
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges();
      },
      error: () => this.toast('No se pudieron cargar los clientes'),
    });
  }

  agregarCantidad(pan:Pan ):void{
    pan.mostrarForm= true;
  }

  confirmarCantidad(pan:Pan):void{
    pan.mostrarForm=false;
  }

  abrirModalCiente(): void{
    const detalles=this.panes.filter(p=> p.cantidad && p.cantidad>0);
    if(detalles.length===0){
      this.toast('Agregar al menos un producto antes de continuar');
      return;
    }
    this.mostrarModalCliente=true;
  }

  confirmarOrden():void{
    if(!this.clienteSeleccionado){
      this.toast('Selecciona un cliente para continuar');
      return;
    }

    const detalles=this.panes.filter(p=>p.cantidad && p.cantidad>0).map(p=>({
      PanidPan: p.idPan,cantidad: p.cantidad!
    }));

    const payload={
      fecha: new Date().toISOString().split('T')[0],
      ClienteId: this.clienteSeleccionado.idCliente,
      EmpleadoId:this.authService.getEmpleado()!.idEmpleado,
      detalles
    };

    this.ordenService.crearOrden(payload).subscribe({
      next:()=>this.router.navigate(['/home']),
      error:()=>this.toast('Error al crear la orden, intenta nuevamente')
    });
  }

  cancelar():void{
    this.router.navigate(['/home']);
  }



 
    
}

    

    
