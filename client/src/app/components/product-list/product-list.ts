import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../common/product';
import { GetResponseProducts, ProductService } from '../../services/product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  imports: [ CurrencyPipe, RouterLink, NgbPagination ],
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products = signal<Product[]>([]);
  currentCategoryId = signal<number>(1);
  previousCategoryId: number = 1;
  previousKeyword: string = '';
  searchMode = signal<boolean>(false);
  pageNumber: number = 1;
  pageSize = signal<number>(5);
  totalElements = signal<number>(0);
  
  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private route: ActivatedRoute
  ) { };

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  };

  listProducts() {
    this.searchMode.set(this.route.snapshot.paramMap.has('keyword'));
    this.searchMode() ? this.handleSearchProduct() : this.handleListProducts();
  };

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    hasCategoryId ? 
      this.currentCategoryId.set(+this.route.snapshot.paramMap.get('id')!) : 
      this.currentCategoryId.set(1)

    if (this.previousCategoryId != this.currentCategoryId()) 
      this.pageNumber = 1;
    this.previousCategoryId = this.currentCategoryId();
    
    this.productService
      .getProductListPaginate(this.pageNumber - 1, this.pageSize(), this.currentCategoryId())
      .subscribe(this.processResult());
  };

  handleSearchProduct() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != theKeyword) 
      this.pageNumber = 1;
    this.previousKeyword = theKeyword;

    this.productService
      .searchProductsPaginate(this.pageNumber - 1, this.pageSize(), theKeyword)
      .subscribe(this.processResult());
  };

  private processResult() {
    return (data: GetResponseProducts) => {
      this.products.set(data._embedded.products);
      this.pageNumber = data.page.number + 1
      this.pageSize.set(data.page.size);
      this.totalElements.set(data.page.totalElements);
    };
  };

  updatePageSize(newPageSize: string) {
    this.pageSize.set(Number(newPageSize));
    this.pageNumber = 1;
    this.listProducts();
  };

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.updateCart(cartItem);
  };
}