import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  imports: [ CurrencyPipe ],
  styleUrl: './product-list.css',
})
export class ProductList {
  products = signal<Product[]>([]);
  
  constructor(private productService: ProductService) { };

  ngOnInit(): void {
    this.listProducts();
  };

  listProducts() {
    this.productService
      .getProductList()
      .subscribe(data => this.products.set(data));
  };
}