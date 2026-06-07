import { inject, Injectable } from '@angular/core';
import { QuesaurillasDb } from './quesaurillas-db';

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  estado: 'pendiente' | 'pagada' | 'cancelada';
}

export interface DetalleVenta {
  id: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface VentaCompleta {
  id: number;
  fecha: string;
  total: number;
  estado: 'pendiente' | 'pagada' | 'cancelada';
  detalle: DetalleVenta[];
}

@Injectable({
  providedIn: 'root',
})


export class Ventas {
  private db= inject(QuesaurillasDb);

  getVentas(): Venta[] {
    return this.db.query<Venta>(`SELECT * FROM ventas WHERE estado= 'pagada' ORDER BY fecha DESC`);
  }


  getDetalleVenta(ventaId: number): DetalleVenta[] {
    return this.db.query<DetalleVenta>(
      `SELECT * FROM detalleVentas WHERE ventaId = ?`,
      [ventaId]
    );
  }


  getReporte(): VentaCompleta[] {
    const ventas = this.getVentas();
    return ventas.map(venta => ({
      ...venta,
      detalle: this.getDetalleVenta(venta.id)
    }));
  }

  crearVentaPendiente(total: number, detalle: {productoId: number, cantidad: number, precioUnitario: number}[]): number {
    this.db.runSilent(`INSERT INTO ventas(total, estado) VALUES (?, 'pendiente')`, [total]);
    const resultado = this.db.query<{id: number}>(`SELECT last_insert_rowid() as id`);
    const ventaId = resultado[0].id;
    for(const item of detalle){
      this.db.runSilent(
        `INSERT INTO detalleVentas (ventaId, productoId, cantidad, precioUnitario) VALUES (?,?,?,?)`,
        [ventaId, item.productoId, item.cantidad, item.precioUnitario]
      );
    }

    this.db.save();
    return ventaId;
  }
  
  pagarVenta(ventaId: number): void {
    this.db.run(`UPDATE ventas SET estado = 'pagada' WHERE id = ?`, [ventaId]);
  }
  cancelarVenta(ventaId: number): void {
    this.db.run(`UPDATE ventas SET estado = 'cancelada' WHERE id = ?`, [ventaId]);
  }

  getVentasHoy(): VentaCompleta[] {
    const hoy = new Date().toISOString().split('T')[0]; // '2026-05-26'
    const ventas = this.db.query<Venta>(
      `SELECT * FROM ventas WHERE estado = 'pagada' AND date(fecha) = ?`,
      [hoy]
    );
    return ventas.map(venta => ({
      ...venta,
      detalle: this.getDetalleVenta(venta.id)
    }));
  }


}
