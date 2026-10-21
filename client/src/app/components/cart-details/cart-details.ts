import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  imports: [ CurrencyPipe, RouterLink ],
  templateUrl: './cart-details.html',
  styleUrl: './cart-details.css',
})
export class CartDetails {
  constructor(public cartService: CartService) { }
}
