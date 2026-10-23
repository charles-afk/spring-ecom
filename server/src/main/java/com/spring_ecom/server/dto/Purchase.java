package com.spring_ecom.server.dto;

import com.spring_ecom.server.entity.Address;
import com.spring_ecom.server.entity.Customer;
import com.spring_ecom.server.entity.Order;
import com.spring_ecom.server.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
