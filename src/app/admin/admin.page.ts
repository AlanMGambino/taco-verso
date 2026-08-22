import { Component, ChangeDetectorRef } from '@angular/core';

import {
  BusinessState,
  ProductoEstado
} from '../core/services/business-state';

import {
  Auth
} from '../core/services/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage {

  negocioAbierto = true;

  productos: ProductoEstado[] = [];


  constructor(
  private businessState: BusinessState,
  private auth: Auth,
  private cdr: ChangeDetectorRef
) {

  this.businessState
    .negocioAbierto$
    .subscribe(abierto => {

      this.negocioAbierto = abierto;

      this.cdr.markForCheck();

    });


  this.businessState
    .productos$
    .subscribe(productos => {

      this.productos = productos;

      this.cdr.markForCheck();

    });

}

cerrarSesion() {

  this.auth.logout();

}


  /* =============================
     NEGOCIO
     ============================= */

  toggleNegocio() {

    this.businessState
      .toggleNegocio();

  }


  /* =============================
     PRODUCTOS
     ============================= */

  toggleProducto(
    producto: ProductoEstado
  ) {

    this.businessState
      .toggleProducto(
        producto.nombre,
        producto.categoria
      );

  }


  /* =============================
     CATEGORÍAS
     ============================= */

  get tacos():
    ProductoEstado[] {

    return this.productos.filter(
      producto =>
        producto.categoria === 'Taco'
    );

  }


  get tortas():
    ProductoEstado[] {

    return this.productos.filter(
      producto =>
        producto.categoria === 'Torta'
    );

  }


  get refrescos():
    ProductoEstado[] {

    return this.productos.filter(
      producto =>
        producto.categoria === 'Refresco'
    );

  }

}