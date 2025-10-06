import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// si prefieres, puedes usar IonicModule en vez de IonContent suelto
import { IonContent, ToastController, NavController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  remember = true;
  showPass = false;
  loading = false;

  get passType() { return this.showPass ? 'text' : 'password'; }

  constructor(
    private auth: AuthService,
    private nav: NavController,
    private toast: ToastController,
  ) {}

  async ngOnInit() {
    // precarga email recordado
    const last = await Preferences.get({ key: 'bn.lastEmail' });
    if (last.value) this.email = last.value;

    // si ya hay sesión activa, ve a /home
    const s = await this.auth.getSession();
    if (s) this.nav.navigateRoot('/home');
  }

  togglePass() { this.showPass = !this.showPass; }

  async onLogin() {
    const email = this.email.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return this.msg('Correo inválido', 'danger');
    }
    if (!this.password) {
      return this.msg('Ingresa tu contraseña', 'warning');
    }

    this.loading = true;
    try {
      await this.auth.login(email, this.password);

      // recordar (o limpiar) el email
      if (this.remember) {
        await Preferences.set({ key: 'bn.lastEmail', value: email });
      } else {
        await Preferences.remove({ key: 'bn.lastEmail' });
      }

      await this.msg('¡Bienvenido! 👋', 'success');
      this.nav.navigateRoot('/home'); // ajusta si tu ruta de inicio es otra
    } catch {
      this.msg('Credenciales inválidas', 'danger');
    } finally {
      this.loading = false;
    }
  }

  goToForgot()   { this.nav.navigateForward('/forgot-password'); }
  goToRegister() { this.nav.navigateForward('/registro'); }

  // Placeholder para el botón de Google
  async loginWithGoogle() {
    this.msg('Google Sign-In pendiente de backend', 'medium');
  }

  private async msg(message: string, color: 'success'|'danger'|'warning'|'primary'|'medium'='primary') {
    const t = await this.toast.create({ message, color, duration: 2200, position: 'bottom' });
    await t.present();
  }
}
