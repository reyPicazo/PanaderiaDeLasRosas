import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden';

@Component({
  selector: 'app-reporte-ordenes',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './reporte-ordenes.html',
  styleUrl: './reporte-ordenes.css',
})
export class ReporteOrdenes implements OnInit {
  ordenes: Orden[] = [];
  ordenSeleccionada: Orden | null = null;
  cargando: boolean = false;

  constructor(
    private ordenService: OrdenService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.cargando = true;
    // Sin filtro de estado → trae todas (pendientes, pagadas, canceladas)
    this.ordenService.getOrdenes().subscribe({
      next: (data) => {
        this.ordenes = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirDetalle(orden: Orden) {
    this.ordenService.getOrdenById(orden.idOrden).subscribe({
      next: (data) => {
        this.ordenSeleccionada = data;
        this.cdr.detectChanges();
      },
      error: () => console.error('Error al cargar detalle de orden')
    });
  }

  cerrarDetalle() {
    this.ordenSeleccionada = null;
  }

  calcularTotal(orden: Orden): number {
    if (!orden.detalles) return 0;
    return orden.detalles.reduce(
      (total, d) => total + d.cantidad * d.pan.precio, 0
    );
  }

  etiquetaEstado(estado: number): string {
    if (estado === 0) return 'Pendiente';
    if (estado === 1) return 'Pagada';
    return 'Cancelada';
  }

  claseEstado(estado: number): string {
    if (estado === 0) return 'badge-pendiente';
    if (estado === 1) return 'badge-pagada';
    return 'badge-cancelada';
  }
}