import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },

  { path: 'splash',  loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage) },
  { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage) },
  { path: 'login',   loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },

{ 
  path: 'forgot-password',
  loadComponent: () =>
    import('./pages/forgot-password/forgot-password.page')
      .then(m => m.ForgotPasswordPage)
},

{
  path: 'verify-pin',
  loadComponent: () =>
    import('./pages/verify-pin/verify-pin.page').then(m => m.VerifyPinPage),
},

{
  path: 'reset-password',
  loadComponent: () =>
    import('./pages/reset-password/reset-password.page')
      .then(m => m.ResetPasswordPage),
},

{
  path: 'registro-page',
  loadComponent: () =>
    import('./pages/registro/registro.page')
      .then(m => m.RegistroPage),
},
  { path: '**', redirectTo: 'login' } 
];