import { Component, OnInit} from '@angular/core';
import { Orden } from '../../models/orden.model';
import { OrdenService } from '../../services/orden';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { InventarioSQ } from '../../services/inventario-sq';

@Component({
  selector: 'app-crear-orden',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './crear-orden.html',
  styleUrl: './crear-orden.css',
})
export class CrearOrden implements OnInit {
  quesadillas: number = 0;
  nuggets: number = 0;
  mostrarFormQuesadillas: boolean = false;
  mostrarFormNuggets: boolean = false;
  cantidadQ:number=0;
  cantidadN:number=0;
  mostrarConfirmacion: boolean = false;
  admin:string='';
  password:string='';
  errorMSG:string='';
  mostrarError: boolean = false;
  editar:boolean=false;
  ordenId:number=0;
  OrdenAux:Orden | undefined;
  ordenEditar:Orden | undefined;
  mostrarErrorQ: boolean = false;
  mostrarErrorN: boolean = false;

  constructor(private ordenService: OrdenService, private router: Router, private authService: AuthService, public inventarioService: InventarioSQ) {
    
  }

  ngOnInit() {
    
    const ordenEditarId = this.ordenService.getordenEditar();
    if(ordenEditarId){
       this.ordenEditar= this.ordenService.getOrdenById(ordenEditarId!);
    }
    
    if(this.ordenEditar){
      this.editar=true;
      this.quesadillas =this.ordenEditar.quesadillas;
      this.nuggets = this.ordenEditar.nuggets;
      this.cantidadQ=this.ordenEditar.quesadillas;
      this.cantidadN=this.ordenEditar.nuggets;
    }
  }

  agregarQuesadilla():void{
    this.mostrarFormQuesadillas = true;
  }

  validarQuesadillas():void{
    if(Number(this.cantidadQ) > this.inventarioService.getCantidad(1)){
    this.mostrarErrorQ = true;
      this.cantidadQ = this.inventarioService.getCantidad(1);
      const input = document.getElementById('cantQ') as HTMLInputElement;
      if(input) input.value = this.cantidadQ.toString();
    }
  }

  agregarNuggets():void{
    this.mostrarFormNuggets = true;
  }

  validarNuggets():void{
    if(Number(this.cantidadN) > this.inventarioService.getCantidad(2)){
      this.mostrarErrorN = true;
      this.cantidadN = this.inventarioService.getCantidad(2);
      const input = document.getElementById('cantN') as HTMLInputElement;
      if(input) input.value = this.cantidadN.toString();
      }
  }

  confirmarQuesadilla():void{
    this.quesadillas = this.cantidadQ;
    this.mostrarFormQuesadillas = false;
    
  }

  confirmarNuggets():void{
    this.nuggets = this.cantidadN;
    this.mostrarFormNuggets = false;
    
  }

  cerrarErrorQ():void{
    this.mostrarErrorQ = false;
  }

  cerrarErrorN():void{
    this.mostrarErrorN = false;
  }


  crearOrden():void{
    if(this.quesadillas <=0 && this.nuggets <=0){
      this.mostrarError = true;
      return;
    }
    if(this.ordenService.getOrdenById(this.ordenEditar?.id!)&& this.editar){
      const quesadilla=this.inventarioService.getProducto(1);
      const nugget=this.inventarioService.getProducto(2);
      const precioQ=quesadilla?.precio ?? 0;
      const precioN=nugget?.precio ?? 0;

      this.ordenEditar!.quesadillas=this.quesadillas;
      this.ordenEditar!.nuggets=this.nuggets;
      this.ordenEditar!.total=(this.quesadillas*precioQ) + (this.nuggets*precioN);

      this.inventarioService.reducirCantidad(1, this.quesadillas);
      this.inventarioService.reducirCantidad(2, this.nuggets);

      this.ordenService.setOrden(this.ordenEditar!);
      this.editar=false;
      this.ordenService.deleteOrdenEditar();
      this.router.navigate(['/home']);
      return;
    }

    

    //crearOrden ya maneja la reducciíon del inventario
    this.ordenService.crearOrden(this.quesadillas, this.nuggets);
    this.router.navigate(['/home']);

  }

  editarOrden(orden:Orden):void{
    
  }

  cerrarError():void{
    this.mostrarError = false;
  }

  cancelar():void{
    this.mostrarConfirmacion = true;

  }

 async confirmarCancelar():Promise<void>{
    if(await this.authService.login(this.admin, this.password)){
      if(this.editar && this.ordenEditar){
        this.inventarioService.reducirCantidad(1, this.ordenEditar.quesadillas);
        this.inventarioService.reducirCantidad(2, this.ordenEditar.nuggets);
        this.ordenService.deleteOrdenEditar();
      }
      this.router.navigate(['/home']);
    }
    else{
      this.errorMSG = 'Credenciales incorrectas. Intente de nuevo.';
    }
  }
}
