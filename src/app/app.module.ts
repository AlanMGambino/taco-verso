import { NgModule } from '@angular/core';

import {
  BrowserModule
} from '@angular/platform-browser';

import {
  RouteReuseStrategy
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular,
  IonApp,
  IonRouterOutlet
} from '@ionic/angular';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  authInterceptor
} from './core/interceptors/auth-interceptor';

import {
  AppComponent
} from './app.component';

import {
  AppRoutingModule
} from './app-routing.module';


@NgModule({

  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,

    AppRoutingModule,

    IonApp,

    IonRouterOutlet
  ],

  providers: [

    provideHttpClient(
  withInterceptors([
    authInterceptor
  ])
),

    provideIonicAngular(),

    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }

  ],

  bootstrap: [
    AppComponent
  ]

})
export class AppModule {}