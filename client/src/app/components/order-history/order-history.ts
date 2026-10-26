import { Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history';
import { OrderHistory as OrderHistoryType } from '../../common/order-history';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  imports: [ CurrencyPipe, DatePipe ],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  orderHistoryList: OrderHistoryType[] = [];
  storage: Storage = localStorage;

  constructor(
    private orderHistoryService: OrderHistoryService
  ) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const email = JSON.parse(this.storage.getItem('userEmail')!);
    this.orderHistoryService.getOrderHistory(email).subscribe(data => {
      this.orderHistoryList = data._embedded.orders;
    })
  }
}
