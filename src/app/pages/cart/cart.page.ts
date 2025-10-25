import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { CartService, CartItem } from '../../services/cart.service';
import { trashOutline } from 'ionicons/icons';  

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule, AppHeaderComponent],
})
export class CartPage implements OnInit {
  items: CartItem[] = [];
  total = 0;
  trashIcon = trashOutline;
  constructor(private cart: CartService, private toast: ToastController) {}

  async ngOnInit() {
    await this.refresh();

    // mantener en sync por si se modifica desde otra página
    this.cart.items$.subscribe(list => {
      this.items = list;
      this.total = this.cart.getTotal(list);
    });
  }

  trackById = (_: number, it: CartItem) => it.id;

  private async refresh() {
    this.items = await this.cart.getItems();
    this.total = this.cart.getTotal(this.items);
  }

  async inc(it: CartItem) {
    await this.cart.setQty(it.id, it.qty + 1);
  }

  async dec(it: CartItem) {
    await this.cart.setQty(it.id, it.qty - 1);
  }

  async remove(it: CartItem) {
    await this.cart.remove(it.id);
    (await this.toast.create({
      message: 'Producto eliminado',
      duration: 900,
      position: 'bottom',
    })).present();
  }

  async clearAll() {
    await this.cart.clear();
    (await this.toast.create({
      message: 'Carrito vaciado',
      duration: 900,
      position: 'bottom',
    })).present();
  }
}
