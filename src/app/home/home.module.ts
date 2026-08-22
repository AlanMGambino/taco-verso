import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonIcon
} from '@ionic/angular';

import { HomePage } from './home.page';

import { MenuCardComponent }
  from '../shared/components/menu-card/menu-card.component';

import { HomePageRoutingModule }
  from './home-routing.module';

  import {
  ProductCustomizerComponent
} from '../shared/components/product-customizer/product-customizer.component';

import {
  CheckoutComponent
} from '../shared/components/checkout/checkout.component';

import {
  OrderConfirmationComponent
} from '../shared/components/order-confirmation/order-confirmation.component';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    IonContent,
    IonIcon
  ],

  declarations: [
    HomePage,
    MenuCardComponent,
    ProductCustomizerComponent,
    CheckoutComponent,
    OrderConfirmationComponent
  ]
})
export class HomePageModule {}