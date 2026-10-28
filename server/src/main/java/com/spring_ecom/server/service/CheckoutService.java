package com.spring_ecom.server.service;

import com.spring_ecom.server.dto.PaymentInfo;
import com.spring_ecom.server.dto.Purchase;
import com.spring_ecom.server.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
