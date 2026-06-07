import { inject, Injectable } from '@angular/core';
import {Orden} from '../models/orden.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ventas } from './ventas';
import { InventarioSQ } from './inventario-sq';

@Injectable({
  providedIn: 'root',
})
export class OrdenService {
  private ventasService= inject(Ventas);
  private inventarioService= inject(InventarioSQ);

  private ordenes: Orden[]=[];
  private ordenesPagadas: Orden[]=[];
  private contOrden=1;
  private ordenesSubject= new BehaviorSubject<Orden | undefined>(undefined);
  private ordenEditarId:number | undefined;

  constructor() {}


  getOrdenes():Orden[]{
    return this.ordenes;
  }

  getOrdenById(id:number):Orden | undefined{
    return this.ordenes.find(orden=>orden.id===id);
  }

  getOrdenActual$():Observable<Orden | undefined>{
    return this.ordenesSubject.asObservable();
  }

  crearOrden(quesadillas:number, nuggets:number):void{
    const quesadilla=this.inventarioService.getProducto(1);
    const nugget=this.inventarioService.getProducto(2);

    const precioQ=quesadilla?.precio ?? 0;
    const precioN=nugget?.precio ?? 0;
    const total=(quesadillas*precioQ) + (nuggets*precioN);

    const ventaId=this.ventasService.crearVentaPendiente(total, [
        {productoId: 1, cantidad: quesadillas, precioUnitario: precioQ},
        {productoId: 2, cantidad: nuggets, precioUnitario: precioN}
    ]);

    this.inventarioService.reducirCantidad(1, quesadillas);
    this.inventarioService.reducirCantidad(2, nuggets);

    const orden:Orden={
      id: this.contOrden++,
      ventaId: ventaId,
      quesadillas,
      nuggets,
      precioQ,
      precioN,
      total
    };

    this.ordenes.push(orden);
    this.ordenesSubject.next(orden);
  }

  pushOrdenPagada(orden:Orden):void{
    this.ordenesPagadas.push(orden);
  }
  saveOrdenEditar(ordenId:number):void{
    this.ordenEditarId=ordenId;
  }
  getordenEditar():number | undefined{
    return this.ordenEditarId;
  }
  deleteOrdenEditar():void{
    this.ordenEditarId=undefined;
  }
  setOrden(orden:Orden):boolean{
    const index = this.ordenes.findIndex(o => o.id === orden.id);
    if (index !== -1) {
      
      this.ordenes[index] = orden;
      this.ordenesSubject.next(orden);
      return true;
    }
    return false;
  }

  eliminarOrden(id: number): void {
    const orden = this.ordenes.find(o => o.id === id);
    if(orden){
      this.ventasService.cancelarVenta(orden.ventaId);
      this.inventarioService.returnCantidad(1, orden.quesadillas);
      this.inventarioService.returnCantidad(2, orden.nuggets);
    }
    this.ordenes = this.ordenes.filter(o => o.id !== id);
    const siguiente=this.ordenes.length > 0 ? this.ordenes[0] : undefined;
    this.ordenesSubject.next(siguiente);
  }

  eliminarOrdenPagada(id: number): void {
    this.ordenes = this.ordenes.filter(o => o.id !== id);
    const siguiente=this.ordenes.length > 0 ? this.ordenes[0] : undefined;
    this.ordenesSubject.next(siguiente);
  }
}
