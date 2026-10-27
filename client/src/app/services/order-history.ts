import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderHistory } from '../common/order-history';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]
  }
};

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl = `${environment.apiUrl}/api/orders`;

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomer_Email?email=${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
};