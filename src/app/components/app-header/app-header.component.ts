import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header', // se usará dentro de <ion-header> en cada página
  imports: [CommonModule, IonicModule, RouterModule],
  template: `
    <ion-toolbar class="toolbar">
      <ion-buttons slot="start" class="left">
        <ion-menu-button autoHide="false" aria-label="Abrir menú"></ion-menu-button>
        <img class="brand-logo" src="assets/images/app-icon.png" alt="BeatNation" />
        <span class="brand-text">BeatNation</span>
      </ion-buttons>

      <ion-buttons slot="end" class="right">
        <ion-button fill="clear" aria-label="Carrito" [routerLink]="['/app/cart']">
          <ion-icon name="cart-outline"></ion-icon>
        </ion-button>
        <div class="divider"></div>
        <ion-avatar class="top-avatar" [routerLink]="['/app/profile']" aria-label="Perfil">
          <img [src]="avatarUrl || 'assets/images/avatar-placeholder.png'" alt="perfil" />
        </ion-avatar>
      </ion-buttons>
    </ion-toolbar>
  `,
  styles: [`
    :host{ display:block; } /* el toolbar ocupa el ancho del header */

    .toolbar{
      --border-width: 0;
      --background: transparent;
      background: linear-gradient(90deg,#e4ecf0 0%,#ffe4eb 100%);
      box-shadow: 0 1px 0 rgba(0,0,0,.06);
    }
    .left{ gap:10px; align-items:center; }
    .right{ gap:12px; align-items:center; }
    .brand-logo{ width:28px; height:28px; border-radius:8px; }
    .brand-text{ font-weight:600; font-size:18px; }
    .divider{ width:1px; height:20px; background:#1113; margin:0 4px; }
    .top-avatar{ width:30px; height:30px; cursor:pointer; }

    /* Oculta el hamburguesa cuando el split-pane está visible (desktop) */
    :host-context(ion-split-pane.split-pane-visible) ion-menu-button{ display:none !important; }
  `]
})
export class AppHeaderComponent implements OnInit {
  user: User | null = null;
  avatarUrl: string | null = null;
  constructor(private auth: AuthService) {}
  async ngOnInit(){
    this.user = await this.auth.getCurrentUser();
    this.avatarUrl = this.user?.avatarUrl ?? null;
  }
}
