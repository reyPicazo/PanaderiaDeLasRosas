import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';

@Injectable({
  providedIn: 'root',
})
export class QuesaurillasDb {
  
  private hashPWD:string='';
  private db: Database | null = null;
  private readonly DB_KEY = 'app_database';

  async init(): Promise<void> {
    const SQL = await initSqlJs({
      locateFile: () => '/assets/sql-wasm.wasm'
    });

    const saved = localStorage.getItem(this.DB_KEY);

    if (saved) {
      const buffer = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
      this.db = new SQL.Database(buffer);
    } else {
      this.db = new SQL.Database();
    }
    await this.hash();
    this.createTables();
  }

  query<T = any>(sql: string, params: any[] = []): T[] {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const results: T[] = [];
    const stmt = this.db.prepare(sql);
    stmt.bind(params);

    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }

    stmt.free();
    return results;
  }

  run(sql: string, params: any[] = []): void {
    if (!this.db) throw new Error('Base de datos no inicializada');
    this.db.run(sql, params);
    this.save();
  }

  save(): void {
    if (!this.db) return;
    const data = this.db.export();
    const base64 = btoa(String.fromCharCode(...data));
    localStorage.setItem(this.DB_KEY, base64);
  }

  private async hash():Promise<void>{
    const encoder = new TextEncoder();
    const data = encoder.encode('root');
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashString = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    this.hashPWD=hashString;
  }

  private createTables(): void{
    
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS usuarios(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);
    this.db!.run(`INSERT OR IGNORE INTO usuarios (id, username, password) VALUES (1, 'admin', '${this.hashPWD}')`);
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS inventario(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producto TEXT NOT NULL,
        precio REAL NOT NULL,
        cantidad INTEGER NOT NULL
      )
    `);
    this.db!.run(`INSERT OR IGNORE INTO inventario (id, producto, precio, cantidad) VALUES (1, 'Quesadilla', 0, 0)`);
    this.db!.run(`INSERT OR IGNORE INTO inventario (id, producto, precio, cantidad) VALUES (2, 'Nugget', 0, 0)`);
    this.db!.run(`
      CREATE TABLE IF NOT EXISTS ventas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        total REAL NOT NULL,
        estado TEXT NOT NULL DEFAULT 'pendiente'
      )
    `); //Agregamos el campo estado para diferenciar entre ventas pagadas y pendientes

    this.db!.run(`
      CREATE TABLE IF NOT EXISTS detalleVentas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ventaId INTEGER NOT NULL,
        productoId INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precioUnitario REAL NOT NULL,
        FOREIGN KEY (ventaId) REFERENCES ventas(id),
        FOREIGN KEY (productoId) REFERENCES inventario(id)
      )
    `);
  }


  runSilent(sql: string, params: any[] = []): void {
    if (!this.db) throw new Error('Base de datos no inicializada');
    this.db.run(sql, params);
  }



}
