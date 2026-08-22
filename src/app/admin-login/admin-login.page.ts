import {
  Component,
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  Auth
} from '../core/services/auth';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: false
})
export class AdminLoginPage {

  private auth =
    inject(Auth);

  private router =
    inject(Router);


  usuario = '';

  password = '';

  cargando = false;

  error = '';


  iniciarSesion() {

    this.error = '';


    const usuarioLimpio =
      this.usuario.trim();


    if (
      !usuarioLimpio ||
      !this.password
    ) {

      this.error =
        'Ingresa usuario y contraseña.';

      return;

    }


    this.cargando = true;


    this.auth
      .login(
        usuarioLimpio,
        this.password
      )
      .subscribe({

        next: () => {

          this.cargando = false;

          this.password = '';

          this.router.navigate([
            '/admin'
          ]);

        },


        error: error => {

          this.cargando = false;


          if (
            error.status === 401
          ) {

            this.error =
              'Usuario o contraseña incorrectos.';

            return;

          }


          if (
            error.status === 403
          ) {

            this.error =
              'Esta cuenta está deshabilitada.';

            return;

          }

          if (
  error.status === 429
) {

  this.error =
    'Demasiados intentos. Espera unos minutos antes de volver a intentar.';

  return;

}

          if (
            error.status === 0
          ) {

            this.error =
              'No se pudo conectar con el servidor.';

            return;

          }


          this.error =
            'Ocurrió un error al iniciar sesión.';

        }

      });

  }

ionViewWillEnter() {

  if (
    this.auth.estaAutenticado()
  ) {

    this.router.navigate([
      '/admin'
    ]);

  }

}

}