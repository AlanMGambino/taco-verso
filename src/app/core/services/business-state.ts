import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import {
  HttpHeaders
} from '@angular/common/http';

import {
  Auth
} from './auth';

import {
  environment
} from '../../../environments/environment';

export interface ProductoEstado {

  id: number;

  nombre: string;

  categoria:
    | 'Taco'
    | 'Torta'
    | 'Refresco';

  precio: number;

  disponible: boolean;

}


interface NegocioApi {

  id: number;

  abierto:
    | boolean
    | number;

  horario: string;

  telefono: string;

  actualizado_en: string;

}


interface ProductoApi {

  id: number;

  nombre: string;

  categoria:
    | 'Taco'
    | 'Torta'
    | 'Refresco';

  precio:
    | number
    | string;

  disponible:
    | boolean
    | number;

}


@Service()
export class BusinessState {

  private auth =
  inject(Auth);

  private http = inject(HttpClient);

  private readonly apiUrl =
  environment.apiUrl;


  private negocioAbiertoSubject =
    new BehaviorSubject<boolean>(false);


  negocioAbierto$ =
    this.negocioAbiertoSubject.asObservable();


  private productosSubject =
    new BehaviorSubject<ProductoEstado[]>([]);


  productos$ =
    this.productosSubject.asObservable();

private inicializar = (() => {
  this.cargarEstadoInicial();
})();


  /* =========================================
     CARGA INICIAL
     ========================================= */

  cargarEstadoInicial() {

    this.cargarNegocio();

    this.cargarProductos();

  }


  /* =========================================
     NEGOCIO
     ========================================= */

  cargarNegocio() {

    this.http
      .get<NegocioApi>(
        `${this.apiUrl}/negocio`
      )
      .subscribe({

        next: negocio => {

          this.negocioAbiertoSubject.next(
            Boolean(negocio.abierto)
          );

        },

        error: error => {

          console.error(
            'Error cargando negocio:',
            error
          );

        }

      });

  }


  setNegocioAbierto(
    abierto: boolean
  ) {

    this.http
      .put(
        `${this.apiUrl}/negocio/estado`,
        {
          abierto
        },
        this.getAuthHeaders()
      )
      .subscribe({

        next: () => {

          this.negocioAbiertoSubject.next(
            abierto
          );

        },

        error: error => {

          console.error(
            'Error actualizando negocio:',
            error
          );

        }

      });

  }


  toggleNegocio() {

    this.setNegocioAbierto(
      !this.negocioAbiertoSubject.value
    );

  }


  /* =========================================
     PRODUCTOS
     ========================================= */

  cargarProductos() {

    this.http
      .get<ProductoApi[]>(
        `${this.apiUrl}/productos`
      )
      .subscribe({

        next: productos => {

          const productosConvertidos:
            ProductoEstado[] =
            productos.map(
              producto => ({

                id: producto.id,

                nombre: producto.nombre,

                categoria:
                  producto.categoria,

                precio:
                  Number(
                    producto.precio
                  ),

                disponible:
                  Boolean(
                    producto.disponible
                  )

              })
            );


          this.productosSubject.next(
            productosConvertidos
          );

        },

        error: error => {

          console.error(
            'Error cargando productos:',
            error
          );

        }

      });

  }


  toggleProducto(
  nombre: string,
  categoria:
    | 'Taco'
    | 'Torta'
    | 'Refresco'
) {

  const producto =
    this.productosSubject.value.find(
      item =>

        item.nombre === nombre &&

        item.categoria === categoria

    );


  if (!producto) {

    console.error(
      'Producto no encontrado:',
      nombre,
      categoria
    );

    return;

  }


  const nuevaDisponibilidad =
    !producto.disponible;


  this.http
    .put(
      `${this.apiUrl}/productos/${producto.id}/disponibilidad`,
      {
        disponible:
          nuevaDisponibilidad
      },
      this.getAuthHeaders()
    )
    .subscribe({

      next: () => {

        const productosActualizados =
          this.productosSubject.value.map(
            item =>

              item.id === producto.id

                ? {
                    ...item,

                    disponible:
                      nuevaDisponibilidad
                  }

                : item
          );


        this.productosSubject.next(
          productosActualizados
        );

      },

      error: error => {

        console.error(
          'Error actualizando producto:',
          error
        );

      }

    });

}


  /* =========================================
     VALORES ACTUALES
     ========================================= */

  get negocioAbiertoActual():
    boolean {

    return this.negocioAbiertoSubject.value;

  }


  get productosActuales():
    ProductoEstado[] {

    return this.productosSubject.value;

  }

  private getAuthHeaders() {

  const token =
    this.auth.getToken();

  return {
    headers:
      new HttpHeaders({
        Authorization:
          `Bearer ${token}`
      })
  };

}
}