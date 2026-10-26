import { Injectable, signal } from '@angular/core';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  totalPrice = signal<number>(0);
  totalQuantity = signal<number>(0);
  storage: Storage = localStorage;

  constructor() {
    if (this.storage.getItem('cartItems') != null) 
      this.computeCartTotals(JSON.parse(this.storage.getItem('cartItems')!));
  }

  computeCartTotals(updatedCart: CartItem[]) {
    this.cartItems.set(updatedCart);
    this.totalPrice.set(this.cartItems().reduce((runningTotal: number, currentItem: CartItem) => runningTotal + (currentItem.unitPrice * currentItem.quantity), 0));
    this.totalQuantity.set(this.cartItems().reduce((runningTotal: number, currentItem: CartItem) => runningTotal + currentItem.quantity, 0));
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems()));
  }

  updateCart(product: CartItem, decremented: boolean = false): void {
    let updatedCart = this.cartItems();
    const existingCartItem = this.cartItems().find((item: CartItem) => item.id === product.id);
  
    if (existingCartItem && !decremented) {
      existingCartItem.quantity++;
    } else if (existingCartItem && decremented && existingCartItem.quantity > 1) {
      existingCartItem.quantity--;
    } else if (existingCartItem && decremented && existingCartItem.quantity == 1) {
      updatedCart = updatedCart.filter((item: CartItem) => item.id !== product.id);
    } else {
      updatedCart = [ ...this.cartItems(), product ];
    }

    this.computeCartTotals(updatedCart);
  };

  incrementQuantity(cartItem: CartItem): void { this.updateCart(cartItem, false) };
  decrementQuantity(cartItem: CartItem): void { this.updateCart(cartItem, true) };
};