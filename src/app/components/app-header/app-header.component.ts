import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

// Importa los SVGs de Ionicons que vas a usar
import { cartOutline, menuOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './app-header.component.html',
  // si prefieres mover los estilos a .scss, cambia a styleUrls
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

  // Íconos expuestos al template (ya no usamos name="..."):
  icons = {
    cart: cartOutline,
    menu: menuOutline,
    user: personCircleOutline,
  };

  constructor(private auth: AuthService) {}

  async ngOnInit(){
    this.user = await this.auth.getCurrentUser();
    this.avatarUrl = this.user?.avatarUrl ?? null;
  }

  // Evita el warning "Blocked aria-hidden..." moviendo el foco
  blurActive() {
    (document.activeElement as HTMLElement)?.blur();
  }

  // Fallback si falla la imagen del avatar
  onAvatarError(e: Event) {
    (e.target as HTMLImageElement).src = 'assets/images/avatar-placeholder.png';
  }
}
