package com.spring_ecom.server.service;

import com.spring_ecom.server.dto.Purchase;
import com.spring_ecom.server.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
