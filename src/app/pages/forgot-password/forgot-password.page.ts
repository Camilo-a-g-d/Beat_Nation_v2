import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; // ajusta la ruta si difiere

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})

export class ForgotPasswordPage {
  email = '';
  loading = false;

  // ⬇️ Nuevo: control de reenvío
  cooldown = 0;              // segundos restantes para reenviar
  private timer?: any;       // setInterval handler
  private readonly COOLDOWN = 30; // 30s

  constructor(
    private navCtrl: NavController,
    private toast: ToastController,
    private auth: AuthService
  ) {}

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private startCooldown() {
    this.cooldown = this.COOLDOWN;
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.cooldown--;
      if (this.cooldown <= 0) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    }, 1000);
  }

  async onRecover() {
    const email = this.email.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return this.showToast('Ingresa un correo válido', 'danger');
    }

    this.loading = true;
    try {
      const { code, expiresAt } = await this.auth.requestPasswordReset(email);

      // (solo demo sin backend) muestra el PIN
      await this.showToast(
        `Código enviado (demo): ${code} | expira: ${new Date(expiresAt).toLocaleTimeString()}`,
        'success'
      );

      this.startCooldown(); // ⬅️ inicia temporizador
      this.navCtrl.navigateForward(['/verify-pin'], { queryParams: { email } });
    } catch (e: any) {
      await this.showToast(
        e?.message === 'EMAIL_NOT_FOUND'
          ? 'Si el correo existe, te enviaremos un PIN.'
          : 'No se pudo iniciar el restablecimiento',
        'warning'
      );
    } finally {
      this.loading = false;
    }
  }

  // ⬇️ Nuevo: reenviar PIN si cooldown terminó
  async resendCode() {
    if (this.cooldown > 0) return; // aún en cooldown
    const email = this.email.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return this.showToast('Ingresa un correo válido', 'danger');
    }

    this.loading = true;
    try {
      const { code, expiresAt } = await this.auth.requestPasswordReset(email);
      await this.showToast(
        `Nuevo código (demo): ${code} | expira: ${new Date(expiresAt).toLocaleTimeString()}`,
        'success'
      );
      this.startCooldown();
    } catch (e) {
      await this.showToast('No se pudo reenviar el PIN', 'warning');
    } finally {
      this.loading = false;
    }
  }

  // 🔁 Volver al login
  goToLogin() { this.navCtrl.navigateRoot('/login'); }

  private async showToast(
    message: string,
    color: 'success' | 'danger' | 'primary' | 'warning' | 'medium' = 'success'
  ) {
    const t = await this.toast.create({ message, color, duration: 2800, position: 'bottom' });
    await t.present();
  }
}

