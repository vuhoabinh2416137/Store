package com.example.demo.service;

import com.example.demo.dto.request.OrderRequestDTO;
import com.example.demo.model.Order;

public interface OrderService {
    Order placeOrder(OrderRequestDTO orderRequestDTO, String username);
}
