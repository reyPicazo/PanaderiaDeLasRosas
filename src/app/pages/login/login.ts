import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../../services/auth';
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
  password: string = ''
  error: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onLogin(){
    if(await this.auth.login(this.username, this.password)){
      this.router.navigate(['/home']);
      
    }else{
      this.error="Usuario o contraseña incorrectos";
    }
  }
}
