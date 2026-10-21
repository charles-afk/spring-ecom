import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-status',
  imports: [ CurrencyPipe, RouterLink ],
  templateUrl: './cart-status.html',
  styleUrl: './cart-status.css',
})
export class CartStatus {
  constructor(public cartService: CartService) { };
};