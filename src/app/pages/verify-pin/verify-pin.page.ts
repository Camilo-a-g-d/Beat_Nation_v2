import { Component, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ajusta la ruta si difiere

@Component({
  standalone: true,
  selector: 'app-verify-pin',
  templateUrl: './verify-pin.page.html',
  styleUrls: ['./verify-pin.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class VerifyPinPage {
  // 4 dígitos como en el mock
  digits = ['', '', '', ''];

  // email viene por query param desde forgot-password
  email = '';

  @ViewChildren('otpInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private toast: ToastController,
    private nav: NavController,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.email = (this.route.snapshot.queryParamMap.get('email') ?? '').toLowerCase();
    if (!this.email) {
      // si llegaron directo sin email, regresa a forgot-password
      this.nav.navigateBack('/forgot-password');
    }
  }

  onInput(e: Event, idx: number) {
    const input = e.target as HTMLInputElement;
    // permitir solo 1 dígito [0-9]
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    this.digits[idx] = input.value;

    if (input.value && idx < this.digits.length - 1) {
      // pasar al siguiente automáticamente
      this.inputs.get(idx + 1)?.nativeElement.focus();
    }
  }

  onKeyDown(e: KeyboardEvent, idx: number) {
    const input = e.target as HTMLInputElement;

    // Backspace sobre vacío -> ir al anterior
    if (e.key === 'Backspace' && !input.value && idx > 0) {
      this.inputs.get(idx - 1)?.nativeElement.focus();
    }

    // Flechas izq/der para navegar
    if (e.key === 'ArrowLeft' && idx > 0) {
      this.inputs.get(idx - 1)?.nativeElement.focus();
      e.preventDefault();
    }
    if (e.key === 'ArrowRight' && idx < this.digits.length - 1) {
      this.inputs.get(idx + 1)?.nativeElement.focus();
      e.preventDefault();
    }
  }

  // pegado de un código completo (opcional si lo usas en el template con (paste)="onPaste($event)")
  onPaste(e: ClipboardEvent) {
    const text = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 4);
    if (!text) return;
    e.preventDefault();
    for (let i = 0; i < this.digits.length; i++) {
      this.digits[i] = text[i] ?? '';
    }
    // mover foco al último lleno
    const filled = Math.min(text.length, this.digits.length) - 1;
    if (filled >= 0) this.inputs.get(filled)?.nativeElement.focus();
  }

  get isComplete() {
    return this.digits.every(d => d !== '');
  }

  async verifyPin() {
    if (!this.isComplete) {
      return this.show('Completa el PIN', 'danger');
    }

    const code = this.digits.join('');

    // valida el PIN contra lo guardado en AuthService
    const ok = await this.auth.verifyPin(this.email, code);
    if (!ok) {
      return this.show('Código inválido o expirado', 'danger');
    }

    await this.show('PIN verificado correctamente', 'success');

    // 👉 Navegar al reset de contraseña con el email
    this.nav.navigateForward(['/reset-password'], { queryParams: { email: this.email } });
  }

  private async show(
    message: string,
    color: 'success' | 'danger' | 'primary' | 'warning' | 'medium' = 'success'
  ) {
    const t = await this.toast.create({ message, color, duration: 2200, position: 'bottom' });
    await t.present();
  }
}
