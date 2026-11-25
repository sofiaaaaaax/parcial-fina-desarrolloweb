import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
  };
}

export interface RegisterResponse {
  id: number;
  nombre: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        sessionStorage.setItem(this.tokenKey, response.token);
        sessionStorage.setItem('usuario', JSON.stringify(response.user));
      })
    );
  }

  register(nombre: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      nombre,
      email,
      password,
    });
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('usuario');
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getUsuarioNombre(): string {
    const raw = sessionStorage.getItem('usuario');
    if (!raw) return '';
    try {
      return JSON.parse(raw).nombre || '';
    } catch {
      return '';
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }
}