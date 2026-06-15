import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Orden } from '../models/orden';


interface CrearOrdenPagar{
  fecha:string,
  ClienteId:number,
  EmpleadoId:number,
  detalles: {PanidPan: number, cantidad: number}[]
}

@Injectable({
  providedIn: 'root',
})
export class OrdenService {
  private apiUrl = `${environment.apiUrl}/ordenes`;
  private ordenEditar: Orden | null=null;
  constructor(private http: HttpClient) {}


  getOrdenes(estado?:-1|0|1, EmpleadoId?: number): Observable<Orden[]> {
    let params =new HttpParams();
    if(estado !== undefined){
      params = params.set('estado', estado.toString());
    }
     if (EmpleadoId !== undefined) params = params.set('EmpleadoId', EmpleadoId.toString());
    return this.http.get<Orden[]>(this.apiUrl, {params});
  }


  getOrdenById(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/${id}`);
  }

  crearOrden(payload: CrearOrdenPagar): Observable<{ message: string; idOrden: number }> {
    return this.http.post<{ message: string; idOrden: number }>(this.apiUrl, payload);
  }

  actualizarEstado(id: number, estado: -1 | 0 | 1): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  actualizarFecha(id: number, fecha: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, { fecha });
  }

  actualizarCantidadDetalle(idOrden: number, idPan: number, cantidad: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${idOrden}/detalles/${idPan}`, { cantidad });
  }

  eliminarDetalle(idOrden: number, idPan: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${idOrden}/detalles/${idPan}`);
  }

  eliminarOrden(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  setOrdenEditar(orden: Orden){
    this.ordenEditar=orden;
  }
  getOrdenEditar(): Orden | null{
    return this.ordenEditar;
  }

  clearOrdenEditar(){
    this.ordenEditar=null;
  }

  actualizarDetallesOrden(idOrden: number, ClienteId: number, detalles: { PanidPan: number; cantidad: number }[]): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${idOrden}/detalles`, { ClienteId, detalles });
  }


}
