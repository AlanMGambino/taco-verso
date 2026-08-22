import {
  Service,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Router
} from '@angular/router';

import {
  BehaviorSubject,
  tap
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

interface LoginResponse {
  message: string;
  token: string;
  usuario: string;
}


@Service()
export class Auth {

  private http =
    inject(HttpClient);

  private router =
    inject(Router);

  private readonly apiUrl =
  `${environment.apiUrl}/auth`;

  private readonly tokenKey =
    'tacoverso_token';

  private readonly usuarioKey =
    'tacoverso_usuario';


  private autenticadoSubject =
    new BehaviorSubject<boolean>(
      this.tieneToken()
    );


  autenticado$ =
    this.autenticadoSubject
      .asObservable();


  login(
    usuario: string,
    password: string
  ) {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      {
        usuario,
        password
      }
    )
    .pipe(

      tap(respuesta => {

        localStorage.setItem(
          this.tokenKey,
          respuesta.token
        );

        localStorage.setItem(
          this.usuarioKey,
          respuesta.usuario
        );

        this.autenticadoSubject
          .next(true);

      })

    );

  }


  logout() {

  localStorage.removeItem(
    this.tokenKey
  );

  localStorage.removeItem(
    this.usuarioKey
  );

  this.autenticadoSubject
    .next(false);

  this.router.navigate([
    '/admin/login'
  ]);

}


  getToken():
    string | null {

    return localStorage.getItem(
      this.tokenKey
    );

  }


  getUsuario():
    string | null {

    return localStorage.getItem(
      this.usuarioKey
    );

  }


  estaAutenticado(): boolean {

  if (!this.tieneToken()) {
    return false;
  }

  if (this.tokenExpirado()) {

    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.usuarioKey
    );

    this.autenticadoSubject
      .next(false);

    return false;
  }

  return true;

}


  private tieneToken():
    boolean {

    return !!localStorage.getItem(
      this.tokenKey
    );

  }

  tokenExpirado(): boolean {

  const token =
    this.getToken();

  if (!token) {
    return true;
  }

  try {

    const payloadBase64 =
      token.split('.')[1];

    const payloadJson =
      atob(
        payloadBase64
          .replace(/-/g, '+')
          .replace(/_/g, '/')
      );

    const payload =
      JSON.parse(payloadJson);

    const expiracion =
      payload.exp * 1000;

    return Date.now() >= expiracion;

  } catch {

    return true;

  }

}

}