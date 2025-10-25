import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },

  // Públicas
  { path: 'splash',  loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage) },
  { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage) },
  { path: 'login',   loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'registro-page', loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage) },
  { path: 'verify-pin', loadComponent: () => import('./pages/verify-pin/verify-pin.page').then(m => m.VerifyPinPage) },
  { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage) },

  // Internas con menú
  {
    path: 'app',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: 'home',      loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
      { path: 'products',  loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPage) },
      { path: 'products/section', loadComponent: () => import('./pages/products-section/products-section.page').then(m => m.ProductsSectionPage) },
      { path: 'cart',      loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage) },
      /*{ path: 'locations', loadComponent: () => import('./pages/ubicaciones/ubicaciones.page').then(m => m.UbicacionesPage) },
      { path: 'profile',   loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage) },
      { path: 'orders',    loadComponent: () => import('./pages/orders/orders.page').then(m => m.OrdersPage) },
      { path: 'promos',    loadComponent: () => import('./pages/promos/promos.page').then(m => m.PromosPage) },*/
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
