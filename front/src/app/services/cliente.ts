import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;  

  constructor(private http: HttpClient) {}


  getClientes(): Observable<Cliente[]> {
      return this.http.get<Cliente[]>(this.apiUrl);
    }
  
    createCliente(cliente: Omit<Cliente, 'idCliente'>): Observable<{ message: string; idCliente: number }> {
      return this.http.post<{ message: string; idCliente: number }>(this.apiUrl, cliente);
    }
  
    updateCliente(id: number, cliente: Omit<Cliente, 'idCliente'>): Observable<{ message: string }> {
      return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, cliente);
    }
  
    deleteCliente(id: number): Observable<{ message: string }> {
      return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }




}
