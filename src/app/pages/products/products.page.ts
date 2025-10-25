import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { CartService } from '../../services/cart.service';   // ⬅️ NUEVO

type Cat = 'ropa' | 'accesorios' | 'instrumentos' | 'posters' | 'vinilos';

interface Slide {
  img: string;
  title: string;
  desc: string;
  cta?: string;
  cat?: Cat;
}

interface ProductCard {
  id: string;
  name: string;
  price: number;
  img: string;
}

interface CatHero {
  id: Cat;
  title: string;
  img: string;
}

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule, AppHeaderComponent],
})
export class ProductsPage implements OnInit {
  constructor(
    private cart: CartService,            // ⬅️ NUEVO
    private toast: ToastController        // ⬅️ NUEVO
  ) {}

  /** HERO */
  slides: Slide[] = [
    { img: 'assets/images/banner-1.png', title: 'Hasta 30% menos en Merch de tus artistas',
      desc: 'Renueva tu outfit con prendas oficiales y colecciones cápsula. Stock limitado por temporada y tallas sujetas a disponibilidad. Envío gratis desde $150.000.',
      cta: 'Ver más', cat: 'ropa' },
    { img: 'assets/images/banner-2.png', title: 'Arma tu home-studio',
      desc: 'Interfaces, teclados y micrófonos seleccionados para que empieces hoy mismo.',
      cta: 'Ver instrumentos', cat: 'instrumentos' },
    { img: 'assets/images/banner-3.png', title: 'Vinilos de colección',
      desc: 'Ediciones especiales y remasterizadas. ¡Que suene la aguja!',
      cta: 'Explorar vinilos', cat: 'vinilos' },
  ];
  currentSlide = 0;
  @ViewChild('heroTrack', { static: true }) heroTrack!: ElementRef<HTMLDivElement>;

  /** LO MÁS VENDIDO */
  bestSellers: ProductCard[] = [
    { id: 'p1', name: 'Camiseta World Tour', price: 69000, img: 'assets/images/tee.png' },
    { id: 'p2', name: 'Sudadera Oversize',   price: 159000, img: 'assets/images/hoodie.png' },
    { id: 'p3', name: 'Gorra Logo',          price: 45000,  img: 'assets/images/cap.png' },
  ];
  @ViewChild('bestTrack', { static: true }) bestTrack!: ElementRef<HTMLDivElement>;

  /** CATEGORÍAS (hero) */
  catHeroes: CatHero[] = [
    { id: 'ropa', title: 'Ropa', img: 'assets/images/ropa.png' },
    { id: 'accesorios', title: 'Accesorios', img: 'assets/images/accesorios.png' },
    { id: 'instrumentos', title: 'Instrumentos', img: 'assets/images/instrumentos.png' },
    { id: 'posters', title: 'Posters', img: 'assets/images/posters.png' },
    { id: 'vinilos', title: 'Vinilos', img: 'assets/images/vinilos.png' },
  ];

  ngOnInit() {}

  /* ---------- Hero controls ---------- */
  slideTo(idx: number) {
    this.currentSlide = (idx + this.slides.length) % this.slides.length;
    const track = this.heroTrack.nativeElement;
    const w = track.clientWidth;
    track.scrollTo({ left: this.currentSlide * w, behavior: 'smooth' });
  }
  prevHero() { this.slideTo(this.currentSlide - 1); }
  nextHero() { this.slideTo(this.currentSlide + 1); }

  /* ---------- Best sellers controls ---------- */
  bestPrev() {
    const el = this.bestTrack.nativeElement;
    el.scrollBy({ left: -el.clientWidth * 0.8, behavior: 'smooth' });
  }
  bestNext() {
    const el = this.bestTrack.nativeElement;
    el.scrollBy({ left:  el.clientWidth * 0.8, behavior: 'smooth' });
  }

  // ⬇️ NUEVO: añadir al carrito
  private normalize(p: any) {
    const id = p?.id ?? p?.slug ?? (p?.name ? p.name.toLowerCase().replace(/\s+/g, '-') : crypto.randomUUID());
    const price = typeof p?.price === 'number' ? p.price : Number(p?.price ?? 0);
    return { id, name: p?.name ?? 'Producto', price, img: p?.img };
  }

  async addToCart(p: any) {
    const prod = this.normalize(p);
    await this.cart.add(prod, 1);
    (await this.toast.create({ message: 'Agregado al carrito', duration: 900, position: 'bottom' })).present();
  }

  trackById = (_: number, p: ProductCard) => p.id;
}
