
import{inject} from '@angular/core';
import { AuthService } from '../services/auth'; 
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const auth= inject(AuthService);
  const router=inject(Router);

  if(auth.isLoggedIn())return true;

  router.navigate(['/login']);
  return false;
};
