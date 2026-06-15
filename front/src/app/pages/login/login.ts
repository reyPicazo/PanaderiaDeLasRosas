import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { EmpleadoService } from '../../services/empleado';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username: string = '';
  error: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private empleadoService: EmpleadoService,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin(): void {
    if (!this.username.trim()) {
      this.error = 'Por favor ingresa tu nombre';
      return;
    }

    this.empleadoService.getEmpleados().subscribe({
      next: (empleados) => {
        const encontrado = empleados.find(
          e => e.nombre.toLowerCase() === this.username.trim().toLowerCase()
        );
        if (encontrado) {
          this.auth.login(encontrado);
          this.router.navigate(['/home']);
        } else {
          this.error = 'Empleado no encontrado';
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.error = 'Error al conectar con el servidor';
        this.cdr.detectChanges();
      }
    });
  }
}