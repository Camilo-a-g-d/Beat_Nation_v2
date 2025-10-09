import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';

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

  /** HERO */
  slides: Slide[] = [
    {
      img: 'assets/images/banners/banner-1.jpg',
      title: 'Hasta 30% menos en Merch de tus artistas',
      desc: 'Renueva tu outfit con prendas oficiales y colecciones cápsula. Stock limitado por temporada y tallas sujetas a disponibilidad. Envío gratis desde $150.000.',
      cta: 'Ver más',
      cat: 'ropa',
    },
    {
      img: 'assets/images/banners/banner-2.jpg',
      title: 'Arma tu home-studio',
      desc: 'Interfaces, teclados y micrófonos seleccionados para que empieces hoy mismo.',
      cta: 'Ver instrumentos',
      cat: 'instrumentos',
    },
    {
      img: 'assets/images/banners/banner-3.jpg',
      title: 'Vinilos de colección',
      desc: 'Ediciones especiales y remasterizadas. ¡Que suene la aguja!',
      cta: 'Explorar vinilos',
      cat: 'vinilos',
    },
  ];
  currentSlide = 0;
  @ViewChild('heroTrack', { static: true }) heroTrack!: ElementRef<HTMLDivElement>;

  /** LO MÁS VENDIDO */
  bestSellers: ProductCard[] = [
    { id: 'p1', name: 'Camiseta World Tour', price: 69000, img: 'assets/images/products/tee.jpg' },
    { id: 'p2', name: 'Sudadera Oversize',   price: 159000, img: 'assets/images/products/hoodie.jpg' },
    { id: 'p3', name: 'Gorra Logo',          price: 45000,  img: 'assets/images/products/cap.jpg' },
  ];
  @ViewChild('bestTrack', { static: true }) bestTrack!: ElementRef<HTMLDivElement>;

  /** CATEGORÍAS (hero) */
  catHeroes: CatHero[] = [
    { id: 'ropa',          title: 'Ropa',           img: 'assets/images/cats/ropa.jpg' },
    { id: 'accesorios',    title: 'Accesorios',     img: 'assets/images/cats/accesorios.jpg' },
    { id: 'instrumentos',  title: 'Instrumentos',   img: 'assets/images/cats/instrumentos.jpg' },
    { id: 'posters',       title: 'Posters',        img: 'assets/images/cats/posters.jpg' },
    { id: 'vinilos',       title: 'Vinilos',        img: 'assets/images/cats/vinilos.jpg' },
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

  trackById = (_: number, p: ProductCard) => p.id;
}
