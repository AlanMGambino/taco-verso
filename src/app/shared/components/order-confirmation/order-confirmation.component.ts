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

  @Input()
  costoEnvio = 0;

  @Input()
subtotal = 0;


  @Output()
  cerrar =
    new EventEmitter<void>();

  @Output()
  corregir =
    new EventEmitter<void>();

  @Output()
  enviar =
    new EventEmitter<void>();


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