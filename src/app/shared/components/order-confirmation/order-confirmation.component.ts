import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  DatosCheckout
} from '../checkout/checkout.component';


export interface ComplementosConfirmacion {
  papas: boolean;
  cebollitas: boolean;
  nopales: boolean;
}


export interface ItemConfirmacion {
  nombre: string;

  tipo:
    | 'Taco'
    | 'Torta'
    | 'Refresco';

  precioUnitario: number;

  cantidad: number;

  queso: boolean;

  complementos:
    ComplementosConfirmacion | null;
}


@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  standalone: false
})
export class OrderConfirmationComponent {

  @Input()
  visible = false;

  @Input()
  carrito: ItemConfirmacion[] = [];

  @Input()
  datosCliente:
    DatosCheckout | null = null;

  @Input()
  total = 0;


  @Output()
  cerrar =
    new EventEmitter<void>();

  @Output()
  corregir =
    new EventEmitter<void>();

  @Output()
  enviar =
    new EventEmitter<void>();


  get subtotalProductos(): number {
    return this.carrito.reduce(
      (total, item) =>
        total +
        item.precioUnitario *
        item.cantidad,
      0
    );
  }


  cerrarConfirmacion() {
    this.cerrar.emit();
  }


  corregirPedido() {
    this.corregir.emit();
  }


  enviarPedido() {
    this.enviar.emit();
  }

}