import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';


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
    { icon: 'shirt-outline',   title: '¿Ropa?',        desc: 'Explora colecciones inspiradas en tus artistas y géneros favoritos. Encuentra prendas que van con tu ritmo.' },
    { icon: 'glasses-outline', title: '¿Accesorios?',  desc: 'Lentes, gorras, cadenas y más. Dale un toque a tu look con detalles que suenan a tu estilo.' },
    { icon: 'musical-notes-outline', title: '¿Instrumentos?', desc: 'Desde el home studio hasta el escenario: teclados, guitarras y equipos para crear tu propio sonido.' },
  ];

  events = [
    { title: 'Radical Optimism Tour', artist: 'Dua Lipa',    date: '28 nov 2025', city: 'Bogotá D. C.', img: 'assets/images/dua.png' },
    { title: 'Cosa Nuestra',          artist: 'Rauw Alejandro', date: '27-28 oct 2025', city: 'Bogotá D. C.', img: 'assets/images/raw_al.png' },
    { title: 'La Cantina',            artist: 'Yeison & Luis A.', date: '29 nov 2025', city: 'Bogotá D. C.', img: 'assets/images/sirvalo.png' },
  ];

  stores = [
    { name: 'Tienda 1', desc: 'Descripción de la tienda en 3 líneas mínimo. Pickup y envíos rápidos.', rating: 4.8, img: 'assets/images/placeholders/store1.jpg' },
    { name: 'Tienda 2', desc: 'Catálogo amplio y asesoría personalizada. Abre hoy hasta las 8pm.',     rating: 4.6, img: 'assets/images/placeholders/store2.jpg' },
    { name: 'Tienda 3', desc: 'Ideal para instrumentos y accesorios. Parqueadero cercano.',            rating: 4.7, img: 'assets/images/placeholders/store3.jpg' },
  ];

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    const u = await this.auth.getCurrentUser();
    if (u?.name) this.firstName = u.name.split(' ')[0];
  }
}
