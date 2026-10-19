import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCategoryMenu } from './components/product-category-menu/product-category-menu';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ProductCategoryMenu
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
