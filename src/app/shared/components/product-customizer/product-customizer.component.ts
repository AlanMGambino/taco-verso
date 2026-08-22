import { Component, EventEmitter, Input, Output, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';

export interface ComplementosPedido {
  papas: boolean;
  cebollitas: boolean;
  nopales: boolean;
}

export interface ProductoPersonalizado {
  nombre: string;
  tipo: 'Taco' | 'Torta';
  precioBase: number;
  queso: boolean;
  complementos: ComplementosPedido;
  cantidad: number;
}

@Component({
  selector: 'app-product-customizer',
  templateUrl: './product-customizer.component.html',
  styleUrls: ['./product-customizer.component.scss'],
  standalone: false
})
export class ProductCustomizerComponent 
  implements OnChanges {
  ngOnChanges(
  changes: SimpleChanges
) {

  if (
    changes['visible'] &&
    this.visible
  ) {

    this.reiniciar();
    this.actualizarTotal();
  }
}
  @Input() visible = false;

  @Input() nombre = '';
  @Input() tipo: 'Taco' | 'Torta' = 'Taco';
  @Input() precioBase = 0;

  @Output() cerrar = new EventEmitter<void>();
  @Output() agregar = new EventEmitter<ProductoPersonalizado>();

  queso = false;

  papas = false;
  cebollitas = false;
  nopales = false;

  cantidad = 1;

  precioUnitarioActual = 0;
totalActual = 0;

actualizarTotal() {

  this.precioUnitarioActual =
    this.precioBase +
    (
      this.permiteQuesoExtra &&
      this.queso
        ? 10
        : 0
    );

  this.totalActual =
    this.precioUnitarioActual *
    this.cantidad;

  this.cdr.detectChanges();
}

  get permiteQuesoExtra(): boolean {
    return this.tipo === 'Taco';
  }

  aumentarCantidad() {

  this.cantidad++;

  this.actualizarTotal();
}

  disminuirCantidad() {

  if (this.cantidad > 1) {
    this.cantidad--;
  }

  this.actualizarTotal();
}

  cerrarModal() {
    this.cerrar.emit();
  }

  agregarAlPedido() {
    this.agregar.emit({
      nombre: this.nombre,
      tipo: this.tipo,
      precioBase: this.precioBase,
      queso: this.permiteQuesoExtra
        ? this.queso
        : true,
      complementos: {
        papas: this.papas,
        cebollitas: this.cebollitas,
        nopales: this.nopales
      },
      cantidad: this.cantidad
    });

    this.reiniciar();
  }

  reiniciar() {

  this.queso = false;

  this.papas = false;
  this.cebollitas = false;
  this.nopales = false;

  this.cantidad = 1;
}

  constructor(
  private cdr: ChangeDetectorRef
) {}
}
