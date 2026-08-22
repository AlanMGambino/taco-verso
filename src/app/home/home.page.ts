import { Component, ChangeDetectorRef } from '@angular/core';

import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';

import {
  ProductoPersonalizado
} from '../shared/components/product-customizer/product-customizer.component';

import {
  DatosCheckout
} from '../shared/components/checkout/checkout.component';

import {
  ItemConfirmacion
} from '../shared/components/order-confirmation/order-confirmation.component';

import {
  BusinessState,
  ProductoEstado
} from '../core/services/business-state';

interface ComplementosCarrito {
  papas: boolean;
  cebollitas: boolean;
  nopales: boolean;
}


interface ItemCarrito {
  nombre: string;

  tipo:
    | 'Taco'
    | 'Torta'
    | 'Refresco';

  precioUnitario: number;

  cantidad: number;

  queso: boolean;

  complementos:
    ComplementosCarrito | null;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  /* =========================================
     PRODUCTOS
     ========================================= */

  tacos: string[] = [
    'Bistec',
    'Longaniza',
    'Pechuga',
    'Enchilada',
    'Campechano'
  ];


  tortas: string[] = [
    'Bistec',
    'Longaniza',
    'Pechuga',
    'Enchilada',
    'Campechana'
  ];


  refrescos: string[] = [
    'Boing Guayaba',
    'Boing Mango',
    'Coca-Cola',
    'Sidral Mundet'
  ];


  /* =========================================
     CARRITO
     ========================================= */

  carrito: ItemCarrito[] = [];

  negocioAbierto = true;

productosDisponibilidad: ProductoEstado[] = [];

totalPedido = 0;
cantidadProductos = 0;

readonly costoEnvio = 15;

costoEnvioActual = 0;

totalFinalPedido = 0;

  /* =========================================
     PERSONALIZADOR
     ========================================= */

  customizerVisible = false;


  productoSeleccionado = {
    nombre: '',
    tipo: 'Taco' as 'Taco' | 'Torta',
    precio: 0
  };


  constructor(
  private cdr: ChangeDetectorRef,
  private businessState: BusinessState
) {

  addIcons({
    chevronDownOutline
  });


  /* =============================
     ESTADO DEL NEGOCIO
     ============================= */

  this.businessState
    .negocioAbierto$
    .subscribe(abierto => {

      this.negocioAbierto = abierto;

      this.cdr.markForCheck();

    });


  /* =============================
     DISPONIBILIDAD
     ============================= */

  this.businessState
    .productos$
    .subscribe(productos => {

      this.productosDisponibilidad =
        productos;

      this.cdr.markForCheck();

    });

}


  /* =========================================
     NAVEGACIÓN
     ========================================= */

  scrollToMenu() {

    const menu =
      document.getElementById('menu');


    menu?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }

  productoDisponible(
  nombre: string,
  categoria:
    | 'Taco'
    | 'Torta'
    | 'Refresco'
): boolean {

  const producto =
    this.productosDisponibilidad.find(
      item =>
        item.nombre === nombre &&
        item.categoria === categoria
    );

  return producto
    ? producto.disponible
    : true;
}

  /* =========================================
     PERSONALIZADOR
     ========================================= */

  abrirPersonalizador(
    nombre: string,
    tipo: 'Taco' | 'Torta',
    precio: number
  ) {

    if (!this.negocioAbierto) {
  return;
}

    this.productoSeleccionado = {
      nombre,
      tipo,
      precio
    };


    this.customizerVisible = true;

  }


  cerrarPersonalizador() {

    this.customizerVisible = false;

  }


  agregarProductoPersonalizado(
  producto: ProductoPersonalizado
) {

  const precioUnitario =
    producto.precioBase +
    (
      producto.tipo === 'Taco' &&
      producto.queso
        ? 10
        : 0
    );


  const index =
    this.carrito.findIndex(item =>

      item.nombre === producto.nombre &&

      item.tipo === producto.tipo &&

      item.queso === producto.queso &&

      item.complementos?.papas ===
        producto.complementos.papas &&

      item.complementos?.cebollitas ===
        producto.complementos.cebollitas &&

      item.complementos?.nopales ===
        producto.complementos.nopales

    );


  if (index !== -1) {

    this.carrito =
      this.carrito.map(
        (item, i) =>

          i === index

            ? {
                ...item,

                cantidad:
                  item.cantidad +
                  producto.cantidad
              }

            : item
      );

  } else {

    this.carrito = [
      ...this.carrito,

      {
        nombre:
          producto.nombre,

        tipo:
          producto.tipo,

        precioUnitario,

        cantidad:
          producto.cantidad,

        queso:
          producto.queso,

        complementos: {
          ...producto.complementos
        }
      }
    ];

  }


  this.customizerVisible = false;

this.recalcularCarrito();

}


  /* =========================================
     REFRESCOS
     ========================================= */

  agregarRefresco(
  nombre: string
) {

  if (!this.negocioAbierto) {
  return;
}

  const index =
    this.carrito.findIndex(item =>

      item.nombre === nombre &&
      item.tipo === 'Refresco'

    );


  if (index !== -1) {

    this.carrito =
      this.carrito.map(
        (item, i) =>

          i === index

            ? {
                ...item,

                cantidad:
                  item.cantidad + 1
              }

            : item
      );

  } else {

    this.carrito = [
      ...this.carrito,

      {
        nombre,

        tipo: 'Refresco',

        precioUnitario: 25,

        cantidad: 1,

        queso: false,

        complementos: null
      }
    ];

  }


  this.recalcularCarrito();

}


  /* =========================================
     CANTIDADES
     ========================================= */

  aumentarCantidadCarrito(
  index: number
) {

  this.carrito =
    this.carrito.map(
      (item, i) =>
        i === index
          ? {
              ...item,
              cantidad: item.cantidad + 1
            }
          : item
    );

  this.recalcularCarrito();
}


  disminuirCantidadCarrito(
  index: number
) {

  const item = this.carrito[index];

  if (item.cantidad > 1) {

    this.carrito =
      this.carrito.map(
        (producto, i) =>
          i === index
            ? {
                ...producto,
                cantidad:
                  producto.cantidad - 1
              }
            : producto
      );

    this.recalcularCarrito();

  } else {

    this.eliminarProducto(index);
  }
}


  eliminarProducto(
  index: number
) {

  this.carrito =
    this.carrito.filter(
      (_, i) =>
        i !== index
    );


    this.recalcularCarrito();
}


  /* =========================================
     TOTALES
     ========================================= */

  private recalcularCarrito() {

  this.totalPedido = this.carrito.reduce(
    (total, item) =>
      total +
      item.precioUnitario * item.cantidad,
    0
  );

  this.cantidadProductos = this.carrito.reduce(
    (total, item) =>
      total + item.cantidad,
    0
  );

  // Recalcula subtotal + envío
  this.recalcularTotalFinal();

  // Actualiza la vista
  this.cdr.detectChanges();

}

  /* =========================================
     CHECKOUT
     ========================================= */

  checkoutVisible = false;


datosCliente:
  DatosCheckout | null = null;


abrirCheckout() {

  if (
    this.carrito.length === 0
  ) {
    return;
  }

  this.checkoutVisible = true;

}


cerrarCheckout() {

  this.checkoutVisible = false;

}

confirmacionVisible = false;

recibirDatosCheckout(
  datos: DatosCheckout
) {

  this.datosCliente = datos;

  this.recalcularTotalFinal();

  this.checkoutVisible = false;

  this.confirmacionVisible = true;

}

cerrarConfirmacion() {

  this.confirmacionVisible = false;

}

corregirPedido() {

  this.confirmacionVisible = false;

  this.checkoutVisible = true;

}


enviarPedidoWhatsApp() {

  if (!this.datosCliente) {
    return;
  }

  const numeroWhatsApp = '525632023290';

  let mensaje = '';

  /* =============================
     ENCABEZADO
     ============================= */

  mensaje += '🌮 *TACOVERSO BROTHERS* 🌮\n';
  mensaje += '━━━━━━━━━━━━━━━━━━━━\n';
  mensaje += '*NUEVO PEDIDO*\n\n';


  /* =============================
     CLIENTE
     ============================= */

  mensaje += '👤 *DATOS DEL CLIENTE*\n';
  mensaje += `Nombre: ${this.datosCliente.nombre}\n`;
  mensaje += `📱 Teléfono: ${this.datosCliente.telefono}\n\n`;


  /* =============================
     ENTREGA
     ============================= */

  if (
    this.datosCliente.tipoEntrega ===
    'domicilio'
  ) {

    mensaje += '🏠 *ENTREGA A DOMICILIO*\n';

    mensaje +=
      `📍 Dirección: ${this.datosCliente.direccion}\n`;

    if (
      this.datosCliente.referencia
    ) {

      mensaje +=
        `🔎 Referencia: ${this.datosCliente.referencia}\n`;

    }

     mensaje +=
    `🛵 Costo de envío: $${this.costoEnvio} MXN\n`;

    mensaje += '\n';

  } else {

    mensaje += '🛍️ *PICKUP*\n';
    mensaje +=
      'El cliente recogerá su pedido en TacoVerso.\n\n';

  }


  /* =============================
     PEDIDO
     ============================= */

  mensaje += '🛒 *PEDIDO*\n';
  mensaje += '━━━━━━━━━━━━━━━━━━━━\n\n';


  this.carrito.forEach(
    (item, index) => {

      /* NOMBRE */

      if (
        item.tipo === 'Refresco'
      ) {

        mensaje +=
          `🥤 *${item.cantidad}x ${item.nombre}*\n`;

      } else {

        const emoji =
          item.tipo === 'Taco'
            ? '🌮'
            : '🥖';

        mensaje +=
          `${emoji} *${item.cantidad}x ${item.tipo} de ${item.nombre}*\n`;

      }


      /* PREPARACIÓN */

      if (
        item.tipo === 'Taco'
      ) {

        mensaje +=
          item.queso
            ? '🧀 Queso: Sí\n'
            : '🧀 Queso: No\n';

      }


      if (
        item.tipo === 'Torta'
      ) {

        mensaje +=
          '🧀 Queso: Incluido\n';

      }


      if (
        item.complementos
      ) {

        mensaje +=
          item.complementos.papas
            ? '🍟 Papas: Sí\n'
            : '🍟 Papas: No\n';

        mensaje +=
          item.complementos.cebollitas
            ? '🧅 Cebollitas: Sí\n'
            : '🧅 Cebollitas: No\n';

        mensaje +=
          item.complementos.nopales
            ? '🌵 Nopales: Sí\n'
            : '🌵 Nopales: No\n';

      }


      /* PRECIO */

      mensaje +=
        `💵 Precio unitario: $${item.precioUnitario}\n`;

      mensaje +=
        `💰 Subtotal: $${item.precioUnitario * item.cantidad}\n`;


      /* SEPARADOR ENTRE PRODUCTOS */

      if (
        index <
        this.carrito.length - 1
      ) {

        mensaje += '\n';

      }

    }
  );


  /* =============================
     INDICACIONES
     ============================= */

  if (
    this.datosCliente.indicaciones
  ) {

    mensaje += '\n\n';
    mensaje += '📝 *INDICACIONES*\n';

    mensaje +=
      `${this.datosCliente.indicaciones}\n`;

  }


  /* =============================
     TOTAL
     ============================= */

  mensaje += '\n';
  mensaje += '━━━━━━━━━━━━━━━━━━━━\n';
  mensaje +=
  `🛒 Subtotal: $${this.totalPedido} MXN\n`;

if (
  this.datosCliente.tipoEntrega ===
  'domicilio'
) {

  mensaje +=
    `🛵 Envío: $${this.costoEnvio} MXN\n`;

}

mensaje +=
  `💰 *TOTAL: $${this.totalFinalPedido} MXN*\n`;
  mensaje += '━━━━━━━━━━━━━━━━━━━━\n\n';

  mensaje +=
    'Pedido realizado desde la página de TacoVerso Brothers 🌮';


  /* =============================
     WHATSAPP
     ============================= */

  const mensajeCodificado =
    encodeURIComponent(mensaje);

  const urlWhatsApp =
    `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;


  window.open(
    urlWhatsApp,
    '_blank'
  );

}

scrollToOrder() {

  const order =
    document.getElementById('ordenar');

  order?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

}

private recalcularTotalFinal() {

  this.costoEnvioActual =
    this.datosCliente?.tipoEntrega ===
      'domicilio'
      ? this.costoEnvio
      : 0;

  this.totalFinalPedido =
    this.totalPedido +
    this.costoEnvioActual;

}

}