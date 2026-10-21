import { Injectable, signal } from '@angular/core';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  total = signal<number>(0);
  totalQuantity = signal<number>(0);

  updateCart(product: CartItem, decremented: boolean = false) {
    let updatedCart = this.cartItems();
    const existingCartItem = this.cartItems().find((item: CartItem) => item.id === product.id);
  
    if (existingCartItem && !decremented) {
      existingCartItem.quantity++;
    } else if (existingCartItem && decremented && existingCartItem.quantity > 1) {
      existingCartItem.quantity--;
    } else if (existingCartItem && decremented && existingCartItem.quantity == 1) {
      updatedCart = updatedCart.filter((item: CartItem) => item.id !== product.id);
    } else {
      updatedCart = [ ...this.cartItems(), product];
    }

    this.cartItems.set(updatedCart);
    this.total.set(updatedCart.reduce((runningTotal: number, currentItem: CartItem) => runningTotal + (currentItem.unitPrice * currentItem.quantity), 0));
    this.totalQuantity.set(updatedCart.reduce((runningTotal: number, currentItem: CartItem) => runningTotal + currentItem.quantity, 0));
  };

  incrementQuantity(cartItem: CartItem) {
    this.updateCart(cartItem, false);
  };

  decrementQuantity(cartItem: CartItem) {
    this.updateCart(cartItem, true);
  };
};