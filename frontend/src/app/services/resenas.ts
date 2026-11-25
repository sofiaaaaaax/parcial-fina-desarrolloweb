import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Resena {
  id?: number;
  nombre_restaurante: string;
  calificacion: number;
  fecha_visita: string;
  observaciones: string;
}

@Injectable({ providedIn: 'root' })
export class ResenasService {
  private readonly apiUrl = 'http://localhost:3000/api/resenas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken() || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  listar(): Observable<Resena[]> {
    return this.http.get<Resena[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crear(resena: Resena): Observable<Resena> {
    return this.http.post<Resena>(this.apiUrl, resena, { headers: this.getHeaders() });
  }

  actualizar(id: number, resena: Resena): Observable<Resena> {
    return this.http.put<Resena>(`${this.apiUrl}/${id}`, resena, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}