import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

import { Login } from './login';
import { AuthService } from '../../services/auth';

describe('Login', () => {

  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;

  const mockAuthService = {
    login: vi.fn()
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [Login, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('debería iniciar sesión y navegar a home', () => {

    component.username = 'admin';
    component.password = '1234';

    mockAuthService.login.mockReturnValue(true);

    component.onLogin();

    expect(mockAuthService.login)
      .toHaveBeenCalledWith('admin', '1234');

    expect(router.navigate)
      .toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar error si las credenciales son incorrectas', () => {

    component.username = 'admin';
    component.password = 'wrongpassword';

    mockAuthService.login.mockReturnValue(false);

    component.onLogin();

    expect(component.error)
      .toBe('Usuario o contraseña incorrectos');
  });

});