import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  modoRegistro = false;
  nombre = '';
  email = '';
  password = '';
  errorMsg = '';
  mensajeExito = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  alternarModo(): void {
    this.modoRegistro = !this.modoRegistro;
    this.errorMsg = '';
    this.mensajeExito = '';
    this.cargando = false;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.errorMsg = '';
    this.mensajeExito = '';

    const correoLimpio = this.email.trim();
    const clave = this.password;
    const nombreLimpio = this.nombre.trim();

    if (!correoLimpio || !clave || (this.modoRegistro && !nombreLimpio)) {
      this.errorMsg = 'Completa todos los campos requeridos.';
      return;
    }

    this.cargando = true;

    if (this.modoRegistro) {
      this.authService.register(nombreLimpio, correoLimpio, clave).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.cargando = false;
            this.modoRegistro = false;
            this.nombre = '';
            this.password = '';
            this.mensajeExito = 'Cuenta creada. Ahora puedes iniciar sesión.';
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.cargando = false;
            this.errorMsg = err?.error?.message || 'Error al registrar usuario.';
            this.cdr.detectChanges();
          });
        },
      });
      return;
    }

    this.authService.login(correoLimpio, clave).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.cargando = false;
          this.router.navigate(['/resenas']);
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.cargando = false;
          this.errorMsg = err?.error?.message || 'Error al iniciar sesión.';
          this.cdr.detectChanges();
        });
      },
    });
  }
}