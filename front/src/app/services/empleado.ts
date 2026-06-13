 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private apiUrl = `${environment.apiUrl}/empleados`;  

  constructor(private http: HttpClient) {}


  getEmpleados(): Observable<Empleado[]> {
      return this.http.get<Empleado[]>(this.apiUrl);
    }
  
    createEmpleado(empleado: Omit<Empleado, 'idEmpleado'>): Observable<{ message: string; idEmpleado: number }> {
      return this.http.post<{ message: string; idEmpleado: number }>(this.apiUrl, empleado);
    }
  
    updateEmpleado(id: number, empleado: Omit<Empleado, 'idEmpleado'>): Observable<{ message: string }> {
      return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, empleado);
    }
  
    deleteEmpleado(id: number): Observable<{ message: string }> {
      return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }




}