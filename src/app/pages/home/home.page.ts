import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';

// 👇 importa los SVG de Ionicons que usarás en las categorías
import {
  shirtOutline,
  glassesOutline,
  musicalNotesOutline,
  helpCircleOutline,
} from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, IonicModule, AppHeaderComponent],
})
export class HomePage implements OnInit {
  firstName = 'BeatLover';

  categories = [
    { icon: 'shirt-outline',           title: '¿Ropa?',         desc: 'Explora colecciones inspiradas en tus artistas y géneros favoritos. Encuentra prendas que van con tu ritmo.' },
    { icon: 'glasses-outline',         title: '¿Accesorios?',   desc: 'Lentes, gorras, cadenas y más. Dale un toque a tu look con detalles que suenan a tu estilo.' },
    { icon: 'musical-notes-outline',   title: '¿Instrumentos?', desc: 'Desde el home studio hasta el escenario: teclados, guitarras y equipos para crear tu propio sonido.' },
  ];

  // 👇 mapa nombre→SVG para usar con [icon]
  iconMap: Record<string, any> = {
    'shirt-outline': shirtOutline,
    'glasses-outline': glassesOutline,
    'musical-notes-outline': musicalNotesOutline,
  };
  fallbackIcon = helpCircleOutline;

  events = [
    { title: 'Radical Optimism Tour', artist: 'Dua Lipa',    date: '28 nov 2025', city: 'Bogotá D. C.', img: 'assets/images/dua.png' },
    { title: 'Cosa Nuestra',          artist: 'Rauw Alejandro', date: '27-28 oct 2025', city: 'Bogotá D. C.', img: 'assets/images/raw_al.png' },
    { title: 'La Cantina',            artist: 'Yeison & Luis A.', date: '29 nov 2025', city: 'Bogotá D. C.', img: 'assets/images/sirvalo.png' },
  ];

  stores = [
    { name: 'Tienda 1', desc: 'Descripción de la tienda en 3 líneas mínimo. Pickup y envíos rápidos.', rating: 4.8, img: 'assets/images/store1.png' },
    { name: 'Tienda 2', desc: 'Catálogo amplio y asesoría personalizada. Abre hoy hasta las 8pm.',     rating: 4.6, img: 'assets/images/store2.png' },
    { name: 'Tienda 3', desc: 'Ideal para instrumentos y accesorios. Parqueadero cercano.',            rating: 4.7, img: 'assets/images/store3.png' },
  ];

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    const u = await this.auth.getCurrentUser();
    if (u?.name) this.firstName = u.name.split(' ')[0];
  }
}
