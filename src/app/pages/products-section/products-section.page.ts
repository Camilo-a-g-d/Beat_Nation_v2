import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { CartService } from '../../services/cart.service';   // ⬅️ NUEVO

type Cat = 'ropa' | 'accesorios' | 'instrumentos' | 'posters' | 'vinilos';

interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  category: Cat;
  flags?: ('best'|'reco')[];
}

@Component({
  standalone: true,
  selector: 'app-products-section',
  templateUrl: './products-section.page.html',
  styleUrls: ['./products-section.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule, AppHeaderComponent],
})
export class ProductsSectionPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,           // ⬅️ NUEVO
    private toast: ToastController       // ⬅️ NUEVO
  ) {}

  categories: { id: Cat; label: string; icon?: string }[] = [
    { id: 'ropa', label: 'Ropa' },
    { id: 'accesorios', label: 'Accesorios' },
    { id: 'instrumentos', label: 'Instrumentos' },
    { id: 'posters', label: 'Posters' },
    { id: 'vinilos', label: 'Vinilos' },
  ];

  catDescs: Record<Cat, string> = {
    ropa: 'Descubre camisetas, hoodies y más con el sello de tus artistas favoritos.',
    accesorios: 'Gorras, gafas y cadenas para elevar tu outfit sin perder el ritmo.',
    instrumentos: 'Desde interfaces y teclados hasta guitarras y micrófonos.',
    posters: 'Arte para tus paredes: ediciones especiales y series limitadas.',
    vinilos: 'Selección de LPs y ediciones de colección remasterizadas.',
  };

  selectedCat: Cat = 'ropa';

  @ViewChild('bestTrack', { static: true }) bestTrack!: ElementRef<HTMLDivElement>;
  @ViewChild('recoTrack', { static: true }) recoTrack!: ElementRef<HTMLDivElement>;

  allProducts: Product[] = [
    { id:'r1', name:'Camiseta World Tour', price: 69000,  img:'assets/images/products/tee.jpg',      category:'ropa',         flags:['best'] },
    { id:'r2', name:'Sudadera Oversize',   price:159000,  img:'assets/images/products/hoodie.jpg',   category:'ropa',         flags:['best','reco'] },
    { id:'r3', name:'Gorra Logo',          price: 45000,  img:'assets/images/products/cap.jpg',      category:'accesorios',   flags:['best'] },
    { id:'r4', name:'Lentes Retro',        price: 99000,  img:'assets/images/products/glasses.jpg',  category:'accesorios',   flags:['reco'] },
    { id:'i1', name:'Guitarra Eléctrica',  price:1299000, img:'assets/images/products/guitar.jpg',   category:'instrumentos', flags:['best'] },
    { id:'i2', name:'Teclado MIDI 49',     price: 549000, img:'assets/images/products/keyboard.jpg', category:'instrumentos', flags:['reco'] },
    { id:'p1', name:'Poster Festival',     price: 39000,  img:'assets/images/products/poster.jpg',   category:'posters',      flags:['best'] },
    { id:'v1', name:'Vinilo LP Classics',  price:119000,  img:'assets/images/products/vinyl.jpg',    category:'vinilos',      flags:['best','reco'] },
    { id:'r5', name:'Camiseta Logo',       price: 59000,  img:'assets/images/products/tee2.jpg',     category:'ropa' },
    { id:'r6', name:'Hoodie Black',        price:179000,  img:'assets/images/products/hoodie2.jpg',  category:'ropa' },
    { id:'a5', name:'Cadena Acero',        price: 79000,  img:'assets/images/products/chain.jpg',    category:'accesorios' },
    { id:'i5', name:'Micrófono Condenser', price: 299000, img:'assets/images/products/mic.jpg',      category:'instrumentos' },
    { id:'po2',name:'Poster Classic',      price: 35000,  img:'assets/images/products/poster2.jpg',  category:'posters' },
    { id:'v2', name:'Vinilo Indie',        price: 99000,  img:'assets/images/products/vinyl2.jpg',   category:'vinilos' },
  ];

  ngOnInit() {
    this.route.queryParamMap.subscribe(q => {
      const c = (q.get('cat') as Cat) || 'ropa';
      this.selectedCat = (this.categories.some(k => k.id === c) ? c : 'ropa');
    });
  }

  get displayName() { return this.categories.find(c => c.id === this.selectedCat)?.label ?? 'Productos'; }
  get heroDesc()    { return this.catDescs[this.selectedCat]; }

  private byCat = (cat: Cat) => this.allProducts.filter(p => p.category === cat);
  get best()  { return this.byCat(this.selectedCat).filter(p => p.flags?.includes('best')).slice(0, 3); }
  get recos() { return this.byCat(this.selectedCat).filter(p => p.flags?.includes('reco')).slice(0, 6); }
  get grid()  { return this.byCat(this.selectedCat).slice(0, 12); }

  setCat(c: Cat) {
    this.router.navigate(['/app/products/section'], { queryParams: { cat: c } });
  }

  // Carruseles (reciben el HTMLElement desde el template: (click)="move(bestEl, -1)")
  move(el: HTMLElement, dir: number) {
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' });
  }

  toList() {
    this.router.navigate(['/app/products'], { queryParams: { cat: this.selectedCat, view: 'list' } });
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

  trackById = (_: number, p: Product) => p.id;
}