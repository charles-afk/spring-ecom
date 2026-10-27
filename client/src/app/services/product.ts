import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }
};

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/api/products`;
  private categoryUrl = `${environment.apiUrl}/api/product-category`;

  constructor(private httpClient: HttpClient) { };

  getProduct(currentCategoryId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${currentCategoryId}`;
    return this.httpClient.get<Product>(productUrl);
  };

  getProductList(currentCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategory_Id?id=${currentCategoryId}`
    return this.getProducts(searchUrl);
  };

  searchProducts(currentKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${currentKeyword}`
    return this.getProducts(searchUrl);
  };

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategory(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  };

  getProductListPaginate(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
    const url = `${this.baseUrl}/search/findByCategory_Id?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  };

  searchProductsPaginate(page: number, pageSize: number, keyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  };
};