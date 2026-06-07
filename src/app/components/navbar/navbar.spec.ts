import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { AuthService } from '../../services/auth';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';


describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  const mockAuthService = {
    getUser: vi.fn().mockReturnValue('Romino')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener el usuario del AuthService', () => {
    expect(component.usuario).toBe('Romino');
    expect(mockAuthService.getUser).toHaveBeenCalled();
  });

});