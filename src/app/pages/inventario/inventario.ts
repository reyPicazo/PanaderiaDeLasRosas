import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioSQ } from '../../services/inventario-sq';
import { Navbar } from '../../components/navbar/navbar';
import { ModalInventario } from "../../components/modal-inventario/modal-inventario";

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, Navbar, ModalInventario],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {

  productos:any[] = [];
  mostrarModal = false;
  productoSeleccionado: any = null;

  cantQuesadillas: number = 0;
  cantNugets: number = 0;

 

  constructor(private inventarioService: InventarioSQ) {}

  ngOnInit() {
    this.cargarProductos(); 
  }
  cargarProductos(){
    this.productos = this.inventarioService.getProductos();
  }

  abrirModal(producto: any){
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
  }

  procesarCantidad(cantidad: number){
    if(this.productoSeleccionado){
      const nuevaCantidad = this.productoSeleccionado.cantidad + cantidad;
      this.inventarioService.setCantidad(this.productoSeleccionado.id, nuevaCantidad);
      this.cargarProductos();
    }
    this.mostrarModal = false;
  }

}
