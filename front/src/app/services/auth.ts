import { Injectable } from '@angular/core';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private empleadoActual: Empleado | null = null;

  login(empleado: Empleado): void {
    this.empleadoActual = empleado;
  }

  logout(): void {
    this.empleadoActual = null;
  }

  isLoggedIn(): boolean {
    return this.empleadoActual !== null;
  }

  getEmpleado(): Empleado | null {
    return this.empleadoActual;
  }
}