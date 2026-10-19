import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  imports: [ CurrencyPipe ],
  styleUrl: './product-list.css',
})
export class ProductList {
  products = signal<Product[]>([]);
  currentCategoryId = signal<number>(1);
  
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { };

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  };

  listProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    hasCategoryId ? 
      this.currentCategoryId.set(+this.route.snapshot.paramMap.get('id')!) : 
      this.currentCategoryId.set(1)

    this.productService
      .getProductList(this.currentCategoryId())
      .subscribe(data => this.products.set(data));
  };
}