import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ResetPasswordPage {
  password = '';
  show = false;

  constructor(private navCtrl: NavController, private toast: ToastController) {}

  get isValid(): boolean {
    // Reglas mínimas (puedes ajustarlas)
    // 8+ caracteres, al menos 1 mayúscula, 1 minúscula, 1 número
    const r =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return r.test(this.password);
  }

  toggle() {
    this.show = !this.show;
  }

  async onSave() {
    if (!this.isValid) {
      return this.showToast(
        'La contraseña debe tener 8+ caracteres, mayúscula, minúscula y número.',
        'danger'
      );
    }

    await this.showToast('¡Contraseña guardada correctamente!', 'success');
    this.navCtrl.navigateRoot('/login'); // o donde necesites
  }

  goLogin() {
    this.navCtrl.navigateBack('/login');
  }

  private async showToast(
    message: string,
    color: 'success' | 'danger' | 'primary' | 'warning' | 'medium' = 'success'
  ) {
    const t = await this.toast.create({
      message,
      color,
      duration: 2400,
      position: 'bottom',
    });
    await t.present();
  }
}
