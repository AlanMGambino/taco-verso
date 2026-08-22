import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';


export interface DatosCheckout {

  tipoEntrega:
    | 'domicilio'
    | 'pickup';

  nombre: string;

  telefono: string;

  direccion: string;

  referencia: string;

  indicaciones: string;

}


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: false
})
export class CheckoutComponent {

  @Input()
  visible = false;

  @Input()
  total = 0;

  @Input()
  cantidadProductos = 0;


  @Output()
  cerrar =
    new EventEmitter<void>();

  @Output()
  continuar =
    new EventEmitter<DatosCheckout>();


  tipoEntrega:
    'domicilio' | 'pickup'
    = 'pickup';


  nombre = '';

  telefono = '';

  direccion = '';

  referencia = '';

  indicaciones = '';


  error = '';


  seleccionarEntrega(
    tipo:
      'domicilio' | 'pickup'
  ) {

    this.tipoEntrega = tipo;

    this.error = '';

  }


  cerrarCheckout() {

    this.error = '';

    this.cerrar.emit();

  }


  validarFormulario(): boolean {

    if (!this.nombre.trim()) {

      this.error =
        'Escribe tu nombre para continuar.';

      return false;

    }


    if (!this.telefono.trim()) {

      this.error =
        'Escribe un número de teléfono.';

      return false;

    }


    const telefonoLimpio =
      this.telefono.replace(
        /\D/g,
        ''
      );


    if (
      telefonoLimpio.length < 10
    ) {

      this.error =
        'Ingresa un número de teléfono válido.';

      return false;

    }


    if (
      this.tipoEntrega ===
        'domicilio' &&
      !this.direccion.trim()
    ) {

      this.error =
        'Necesitamos la dirección para realizar la entrega.';

      return false;

    }


    this.error = '';

    return true;

  }


  continuarPedido() {

    if (
      !this.validarFormulario()
    ) {
      return;
    }


    const datos:
      DatosCheckout = {

      tipoEntrega:
        this.tipoEntrega,

      nombre:
        this.nombre.trim(),

      telefono:
        this.telefono.trim(),

      direccion:
        this.tipoEntrega ===
          'domicilio'
          ? this.direccion.trim()
          : '',

      referencia:
        this.tipoEntrega ===
          'domicilio'
          ? this.referencia.trim()
          : '',

      indicaciones:
        this.indicaciones.trim()

    };


    this.continuar.emit(datos);

  }

}