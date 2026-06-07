import { Injectable, inject } from '@angular/core';
import { QuesaurillasDb } from './quesaurillas-db';

export interface User{
  id: number;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Users {
  readonly db = inject(QuesaurillasDb);

  async hashPassword(password: string): Promise<string> {
    const encoder= new TextEncoder();
    const data=encoder.encode(password);
    const hash=await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2, '0')).join('');
  }
  getAllUsers(): User[]{
    return this.db.query<User>(`SELECT * FROM usuarios`);
  }

  getUserById(id: number): User | null{
    const result = this.db.query<User>(
      `SELECT * FROM usuarios WHERE id = ?`, [id]
    );
    return result[0] ?? null;
  }

  async getUserforLogin(username: string, password: string): Promise<User | null>{
    const hashedPassword = await this.hashPassword(password);
    const result = this.db.query<User>(
      `SELECT * FROM usuarios WHERE username = ? AND password = ?`, [username, hashedPassword]
    );
    return result[0] ?? null;
  }


  async setUser(username: string, password: string): Promise<void>{
    const hashedPassword = await this.hashPassword(password);
    this.db.run(
      `INSERT INTO usuarios (username, password) VALUES (?, ?)`, [username, hashedPassword]
    );
  }

  async updateUser(id: number, username?: string, password?: string): Promise<void> {
  if (username) {
    this.db.run(
      `UPDATE usuarios SET username = ? WHERE id = ?`, [username, id]
    );
  }
  if (password) {
    const hashedPassword = await this.hashPassword(password);
    this.db.run(
      `UPDATE usuarios SET password = ? WHERE id = ?`, [hashedPassword, id]
    );
  }
}

  deleteUser(id: number): void{
    this.db.run(
      `DELETE FROM usuarios WHERE id = ?`, [id]
    );
  }

}
