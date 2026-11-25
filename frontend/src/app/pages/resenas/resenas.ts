import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Resena, ResenasService } from '../../services/resenas';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css',
})
export class Resenas implements OnInit {
  resenas: Resena[] = [];
  editandoId: number | null = null;
  mensaje = '';
  errorMsg = '';
  usuarioNombre = '';
  cargandoLista = false;

  form: Resena = {
    nombre_restaurante: '',
    calificacion: 5,
    fecha_visita: '',
    observaciones: '',
  };

  constructor(
    private resenasService: ResenasService,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuarioNombre = this.authService.getUsuarioNombre();
    this.cargarResenas();
  }

  cargarResenas(): void {
    this.errorMsg = '';
    this.cargandoLista = true;

    this.resenasService.listar().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.resenas = Array.isArray(data) ? [...data] : [];
          this.cargandoLista = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.cargandoLista = false;
          if (err?.status === 401) {
            this.cerrarSesion();
          } else {
            this.errorMsg = err?.error?.message || 'No se pudieron cargar las reseñas.';
          }
          this.cdr.detectChanges();
        });
      },
    });
  }

  guardarResena(): void {
    this.mensaje = '';
    this.errorMsg = '';

    if (!this.form.nombre_restaurante.trim() || !this.form.fecha_visita) {
      this.errorMsg = 'El nombre del restaurante y la fecha de visita son obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    const payload: Resena = {
      nombre_restaurante: this.form.nombre_restaurante.trim(),
      calificacion: Number(this.form.calificacion),
      fecha_visita: this.form.fecha_visita,
      observaciones: (this.form.observaciones || '').trim(),
    };

    if (this.editandoId !== null) {
      this.resenasService.actualizar(this.editandoId, payload).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.mensaje = 'Reseña actualizada.';
            this.limpiarFormulario();
            this.cargarResenas();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.errorMsg = err?.error?.message || 'Error al actualizar la reseña.';
            this.cdr.detectChanges();
          });
        },
      });
    } else {
      this.resenasService.crear(payload).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.mensaje = 'Reseña creada.';
            this.limpiarFormulario();
            this.cargarResenas();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.errorMsg = err?.error?.message || 'Error al crear la reseña.';
            this.cdr.detectChanges();
          });
        },
      });
    }
  }

  editarResena(resena: Resena): void {
    this.mensaje = '';
    this.errorMsg = '';
    this.editandoId = resena.id ?? null;
    this.form = {
      nombre_restaurante: resena.nombre_restaurante,
      calificacion: resena.calificacion,
      fecha_visita: resena.fecha_visita,
      observaciones: resena.observaciones || '',
    };
  }

  eliminarResena(id?: number): void {
    if (!id) return;
    this.mensaje = '';
    this.errorMsg = '';

    this.resenasService.eliminar(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.mensaje = 'Reseña eliminada.';
          if (this.editandoId === id) {
            this.limpiarFormulario();
          }
          this.cargarResenas();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.errorMsg = err?.error?.message || 'Error al eliminar la reseña.';
          this.cdr.detectChanges();
        });
      },
    });
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.form = {
      nombre_restaurante: '',
      calificacion: 5,
      fecha_visita: '',
      observaciones: '',
    };
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}