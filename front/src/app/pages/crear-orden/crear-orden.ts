import { ChangeDetectorRef, Component, OnInit} from '@angular/core';

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
import {Orden} from '../../models/orden';

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
  ordenEditando: Orden | null=null;

  constructor(private ordenService: OrdenService, private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef, private panService: PanService, private clienteService: ClienteService) {}
    
  

  ngOnInit(){
    this.ordenEditando=this.ordenService.getOrdenEditar();
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

        if(this.ordenEditando?.detalles){
          this.panes=this.panes.map(p=>{
            const detalle=this.ordenEditando!.detalles!.find(d=> d.pan.idPan === p.idPan);
            return detalle ? {...p, cantidad: detalle.cantidad} : p;
          });

          this.clienteSeleccionado=this.ordenEditando.cliente;
        }
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
    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

    if(this.ordenEditando){
      this.ordenService.actualizarDetallesOrden(this.ordenEditando.idOrden, this.clienteSeleccionado.idCliente,detalles).subscribe({
        next:()=>{
          
          this.ordenService.clearOrdenEditar();
          this.router.navigate(['/home']);
        },
        error:()=> this.toast('Error al actualizar la orden, intenta nuevamente')
      });
      
    }else{
      this.crearNuevaOrden(fecha,detalles);
    }
    
  }

  crearNuevaOrden(fecha:string, detalles:{PanidPan: number, cantidad: number}[]):void{
    const payload={
      fecha,
      ClienteId: this.clienteSeleccionado!.idCliente,
      EmpleadoId:this.authService.getEmpleado()!.idEmpleado,
      detalles
    };

    this.ordenService.crearOrden(payload).subscribe({
      next:()=>this.router.navigate(['/home']),
      error:()=>this.toast('Error al crear la orden, intenta nuevamente')
    });
  }

  cancelar():void{
    this.ordenService.clearOrdenEditar();
    this.router.navigate(['/home']);
  }






 
    
}

    

    
