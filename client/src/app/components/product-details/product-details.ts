import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product } from '../../common/product';

@Component({
  selector: 'app-product-details',
  imports: [ RouterLink, CurrencyPipe ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product = signal<Product|null>(null);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProductDetails();
    });
  };

  getProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService
      .getProduct(theProductId)
      .subscribe(data => this.product.set(data));
  };
}
