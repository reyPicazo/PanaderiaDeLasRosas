import { inject, Injectable } from '@angular/core';
import { QuesaurillasDb } from './quesaurillas-db';

export interface Producto{
  id: number;
  producto: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})


export class InventarioSQ { 


  

  

  //USO CON SQL.JS


  private db = inject(QuesaurillasDb);

  getProductos(): Producto[] {
    return this.db.query<Producto>(`SELECT * FROM inventario`);
  }

  getProducto(id: number): Producto | null {
    const result = this.db.query<Producto>(
      `SELECT * FROM inventario WHERE id = ?`, [id]
    );
    return result[0] ?? null;
  }

  agregarProducto(producto: string, precio: number, cantidad: number): void {
    this.db.run(
      `INSERT INTO inventario (producto, precio, cantidad) VALUES (?, ?, ?)`,
      [producto, precio, cantidad]
    );
  }


  reducirCantidad(id: number, cantidad: number): void {
    this.db.run(
      `UPDATE inventario SET cantidad = cantidad - ? WHERE id = ?`,
      [cantidad, id]
    );
  }

  returnCantidad(id: number, cantidad: number): void {
    this.db.run(
      `UPDATE inventario SET cantidad = cantidad + ? WHERE id = ?`,
      [cantidad, id]
    );
  }

  actualizarProducto(id: number, campos: { precio?: number; cantidad?: number }): void {
    const sets: string[] = [];
    const params: any[] = [];

    if (campos.precio !== undefined) {
      sets.push('precio = ?');
      params.push(campos.precio);
    }

    if (campos.cantidad !== undefined) {
      sets.push('cantidad = ?');
      params.push(campos.cantidad);
    }

    if (sets.length === 0) return; 

    params.push(id);

    this.db.run(
      `UPDATE inventario SET ${sets.join(', ')} WHERE id = ?`,
      params
    );
  }

  getCantidad(id: number): number {
    const result = this.db.query<{ cantidad: number }>(
      `SELECT cantidad FROM inventario WHERE id = ?`, [id]
    );
    return result[0]?.cantidad ?? 0;
  }

  setCantidad(id: number, cantidad: number): void {
    this.db.run(
      `UPDATE inventario SET cantidad = ? WHERE id = ?`,
      [cantidad, id]
    );
  }

  deleteProducto(id: number): void {
    this.db.run(
      `DELETE FROM inventario WHERE id = ?`,
      [id]
    );
  }


}
