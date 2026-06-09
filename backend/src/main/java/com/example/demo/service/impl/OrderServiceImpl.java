package com.example.demo.service.impl;

import com.example.demo.dto.request.OrderRequestDTO;
import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.OrderService;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Order placeOrder(OrderRequestDTO orderRequestDTO, String username) {
        Product product = productRepository.findById(orderRequestDTO.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order(
            orderRequestDTO.getCustomerName(),
            orderRequestDTO.getCustomerPhone(),
            orderRequestDTO.getCustomerAddress(),
            product,
            user
        );

        return orderRepository.save(order);
    }
}
