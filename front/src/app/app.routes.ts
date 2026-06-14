import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';
import { CrearOrden } from './pages/crear-orden/crear-orden';
import { Administrar } from './pages/administrar/administrar';

import { Productos } from './pages/productos/productos';
import { Empleados } from './pages/empleados/empleados';
import { Clientes } from './pages/clientes/clientes';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: Login},
    {path: 'home', component: Home, canActivate: [authGuard]},
    {path: 'crear-orden', component:CrearOrden, canActivate: [authGuard]},
    {path: 'administrar', component: Administrar, canActivate: [authGuard]},
    {path: 'productos', component: Productos, canActivate: [authGuard]},
    {path: 'empleados', component: Empleados, canActivate: [authGuard]},
    {path: 'clientes', component: Clientes, canActivate: [authGuard]},
];
