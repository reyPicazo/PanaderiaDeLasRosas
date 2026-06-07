import { Injectable, inject } from '@angular/core';
import { Users } from './users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private usersService= inject(Users);

  async login(username:string, password:string): Promise<boolean> {
    const user = await this.usersService.getUserforLogin(username, password);
    if(user){
      localStorage.setItem('sesion', 'true');
      localStorage.setItem('usuario', username);
      return true;
    }
    return false;
  }

  logout():void{
    localStorage.removeItem('sesion');
    localStorage.removeItem('usuario');

  }

  isLoggedIn():boolean{
    return localStorage.getItem('sesion') === 'true';
  }

  getUser():string{
    return localStorage.getItem('usuario') ?? 'invitado';
  }
}
