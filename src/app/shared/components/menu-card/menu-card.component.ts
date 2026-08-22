import { Component, Input } from '@angular/core';

import {
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss'],
  standalone: false
})
export class MenuCardComponent {

  irAOrdenar() {
  this.ordenarAhora.emit();
}

  @Input() title = '';
  @Input() icon = '';

  @Input() price = '';
  @Input() priceLabel = '';

  @Input() items: string[] = [];

  @Input() noteIcon = '';
  @Input() noteTitle = '';
  @Input() noteText = '';
  @Input() notePrice = '';

  // Imagen de la categoría
  @Input() image = '';

  // Permite alternar foto izquierda / derecha
  @Input() imagePosition: 'left' | 'right' = 'left';

  @Input() showComplements = false;

@Input() complementsText =
  'Puedes acompañar con papas a la francesa, cebollitas y nopales.';

@Input() showSauces = false;

@Input() saucesText =
  'Contamos con salsa verde y salsa roja.';

  @Output() ordenarAhora =
  new EventEmitter<void>();

}