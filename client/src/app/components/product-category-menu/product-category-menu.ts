import { Component, signal, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-product-category-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './product-category-menu.html',
  styleUrl: './product-category-menu.css',
})
export class ProductCategoryMenu implements OnInit {
  productCategories = signal<ProductCategory[]>([]);

  constructor(private productService: ProductService) { };

  ngOnInit() {
    this.listProductCategory();
  };

  listProductCategory() {
    this.productService
      .getProductCategory()
      .subscribe(data => this.productCategories.set(data));
  }
}
