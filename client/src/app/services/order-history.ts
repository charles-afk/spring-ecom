import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderHistory } from '../common/order-history';

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

  getOrderHistory(email: string) {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
};