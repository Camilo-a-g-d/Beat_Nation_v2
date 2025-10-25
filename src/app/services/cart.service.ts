import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { StorageService } from './storage.service';

export interface CartItem {
  id: string;
  name: string;
  price: number;    // COP
  img?: string;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly KEY = 'bn.cart';
  private _items$ = new BehaviorSubject<CartItem[]>([]);
  /** stream público de items */
  readonly items$ = this._items$.asObservable();
  /** total en COP (stream) */
  readonly total$ = this.items$.pipe(
    map(list => list.reduce((acc, it) => acc + it.price * it.qty, 0))
  );

  /** promesa de carga inicial, para asegurar que load() terminó antes de leer */
  private ready: Promise<void>;

  constructor(private storage: StorageService) {
    this.ready = this.load(); // cargar al iniciar (y guardar la promesa)
  }

  // ---------- Persistencia ----------
  private async load() {
    const data = await this.storage.get<CartItem[]>(this.KEY);
    this._items$.next(Array.isArray(data) ? data : []);
  }
  private async save() {
    await this.storage.set(this.KEY, this._items$.value);
  }

  // ---------- Consultas ----------
  /** snapshot actual */
  get items(): CartItem[] { return this._items$.value; }
  /** cantidad total de unidades */
  get count(): number { return this.items.reduce((n, it) => n + it.qty, 0); }
  /** total en COP */
  get total(): number { return this.items.reduce((a, it) => a + it.price * it.qty, 0); }

  /** ¿existe el producto en el carrito? */
  has(id: string) {
    return this.items.some(i => i.id === id);
  }

  /** cantidad de un producto específico (0 si no existe) */
  qtyOf(id: string) {
    return this.items.find(i => i.id === id)?.qty ?? 0;
  }

  // ---------- Mutaciones ----------
  /** agrega (o incrementa) un producto */
  async add(prod: { id: string; name: string; price: number; img?: string }, qty = 1) {
    const items = [...this.items];
    const i = items.findIndex(x => x.id === prod.id);
    if (i >= 0) {
      items[i] = { ...items[i], qty: Math.min(99, items[i].qty + qty) };
    } else {
      items.push({ ...prod, qty: Math.max(1, qty) });
    }
    this._items$.next(items);
    await this.save();
  }

  /** actualiza cantidad; si qty <= 0 elimina */
  async updateQty(id: string, qty: number) {
    const items = [...this.items];
    const i = items.findIndex(x => x.id === id);
    if (i === -1) return;
    if (qty <= 0) {
      items.splice(i, 1);
    } else {
      items[i] = { ...items[i], qty: Math.min(99, qty) };
    }
    this._items$.next(items);
    await this.save();
  }

  /** incrementa/decrementa en delta (+1/-1) */
  async inc(id: string, delta = 1) {
    const current = this.qtyOf(id);
    await this.updateQty(id, current + delta);
  }

  /** elimina un producto */
  async remove(id: string) {
    const items = this.items.filter(x => x.id !== id);
    this._items$.next(items);
    await this.save();
  }

  /** vacía el carrito */
  async clear() {
    this._items$.next([]);
    await this.storage.remove(this.KEY);
  }

  // ---------- WRAPPERS para compatibilidad con tu UI ----------
  /** Cargar carrito desde storage/estado (forma async para tu página) */
  async getItems(): Promise<CartItem[]> {
    await this.ready;               // asegura que load() terminó
    return [...this.items];         // copia defensiva
  }

  /** Calcular total $ del carrito (acepta lista opcional) */
  getTotal(list?: CartItem[]): number {
    const arr = list ?? this.items;
    return arr.reduce((a, it) => a + it.price * it.qty, 0);
  }

  /** Actualiza cantidad directamente (alias de updateQty) */
  async setQty(id: string, qty: number) {
    return this.updateQty(id, qty);
  }
}
