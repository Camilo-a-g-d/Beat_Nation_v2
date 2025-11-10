import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { IonicModule, NavController, ToastController, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

import { chevronBackOutline, closeOutline } from 'ionicons/icons';

=======
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

>>>>>>> d3e00715681a8e4ac5207dc95788a6c450c63e4d
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
<<<<<<< HEAD
  /** >=992px */
  isDesktop = false;
  /** sidebar fijado (split-pane activo) */
  isPinned = true;

=======
  /** true => menú fijo (split-pane visible) */
  isDesktop = false;
>>>>>>> d3e00715681a8e4ac5207dc95788a6c450c63e4d
  private mq!: MediaQueryList;

  user: User | null = null;
  avatarUrl: string | null = null;
  displayName = '';

<<<<<<< HEAD
  // para usar con [icon]
  icons = {
    chevronBack: chevronBackOutline,
    close: closeOutline,
  };

  menu: MenuItem[] = [
=======
  menu: MenuItem[] = [
   /* { label: 'Inicio',      route: '/app/home' },*/
>>>>>>> d3e00715681a8e4ac5207dc95788a6c450c63e4d
    { label: 'Productos',   route: '/app/products' },
    { label: 'Tiendas',     route: '/app/locations' },
    { label: 'Perfil',      route: '/app/profile' },
    { label: 'Pedidos',     route: '/app/orders' },
    { label: 'Promociones', route: '/app/promos' },
  ];

  constructor(
    private auth: AuthService,
    private nav: NavController,
<<<<<<< HEAD
    private toast: ToastController,
    private menuCtrl: MenuController,
  ) {}

  async ngOnInit() {
    this.mq = window.matchMedia('(min-width: 992px)');
    this.isDesktop = this.mq.matches;

    this.mq.addEventListener('change', e => {
      this.isDesktop = e.matches;
      // al salir de desktop desancla el menú
      if (!this.isDesktop) this.isPinned = false;
    });

=======
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
>>>>>>> d3e00715681a8e4ac5207dc95788a6c450c63e4d
    await this.refreshUser();
  }

  private async refreshUser() {
    this.user = await this.auth.getCurrentUser();
    this.avatarUrl = this.user?.avatarUrl ?? null;
    this.displayName = (this.user?.name || '').split(' ')[0] || '';
  }

<<<<<<< HEAD
  togglePin() {
    this.isPinned = !this.isPinned;
    // si lo pasamos a overlay, ciérralo por si estaba abierto
    if (!this.isPinned) this.menuCtrl.close();
  }

=======
>>>>>>> d3e00715681a8e4ac5207dc95788a6c450c63e4d
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
