import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

interface MenuItem {
  icon?: string;
  label: string;
  route: string;
}

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  /** true => menú fijo (split-pane visible) */
  isDesktop = false;
  private mq!: MediaQueryList;

  user: User | null = null;
  avatarUrl: string | null = null;
  displayName = '';

  menu: MenuItem[] = [
   /* { label: 'Inicio',      route: '/app/home' },*/
    { label: 'Productos',   route: '/app/products' },
    { label: 'Tiendas',     route: '/app/locations' },
    { label: 'Perfil',      route: '/app/profile' },
    { label: 'Pedidos',     route: '/app/orders' },
    { label: 'Promociones', route: '/app/promos' },
  ];

  constructor(
    private auth: AuthService,
    private nav: NavController,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    // 1) media query manual y reactivo
    this.mq = window.matchMedia('(min-width: 992px)');
    this.isDesktop = this.mq.matches;
    // Nota: addEventListener está soportado en navegadores modernos
    this.mq.addEventListener('change', e => {
      this.isDesktop = e.matches;
      console.log('[SplitPane] desktop?', this.isDesktop);
    });

    // 2) datos de usuario
    await this.refreshUser();
  }

  private async refreshUser() {
    this.user = await this.auth.getCurrentUser();
    this.avatarUrl = this.user?.avatarUrl ?? null;
    this.displayName = (this.user?.name || '').split(' ')[0] || '';
  }

  async onLogout() {
    await this.auth.logout();
    (await this.toast.create({
      message: 'Sesión cerrada',
      duration: 1600,
      position: 'bottom',
    })).present();
    this.nav.navigateRoot('/login');
  }

  goToCart()    { this.nav.navigateForward('/app/cart'); }
  goToProfile() { this.nav.navigateForward('/app/profile'); }
}
