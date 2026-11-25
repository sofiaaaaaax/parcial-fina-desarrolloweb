import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Login } from './pages/login/login';
import { Resenas } from './pages/resenas/resenas';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'resenas', component: Resenas, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];