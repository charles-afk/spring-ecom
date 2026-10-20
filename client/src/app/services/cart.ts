import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClient) { };

  cartItems = signal<CartItem[]>([]);
  total = signal<number>(0);

  updateCart(product: CartItem) {
    this.cartItems.update(prevCart => [...prevCart, product]);
    this.total.set(this.cartItems().reduce((runningTotal, currentItem) => runningTotal + currentItem.unitPrice, 0));
  };
}
