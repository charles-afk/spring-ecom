import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderHistory } from '../common/order-history';
import { Observable } from 'rxjs';

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]
  }
};

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl = "http://localhost:8080/api/orders";

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomer_Email?email=${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
};