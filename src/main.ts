import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// OPCIONAL: registrar íconos globalmente por si tienes <ion-icon name="..."> en otras vistas
import { addIcons } from 'ionicons';
import { cartOutline, menuOutline, personCircleOutline } from 'ionicons/icons';

// Registra ANTES del bootstrap
addIcons({
  'cart-outline': cartOutline,
  'menu-outline': menuOutline,
  'person-circle-outline': personCircleOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
