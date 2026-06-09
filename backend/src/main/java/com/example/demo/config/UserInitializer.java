package com.example.demo.config;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserInitializer {

    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User("admin", passwordEncoder.encode("123456"), Role.MANAGER, "Quản trị viên");
                userRepository.save(admin);
            }
            if (!userRepository.existsByUsername("khachhang")) {
                User customer = new User("khachhang", passwordEncoder.encode("123456"), Role.CUSTOMER, "Khách hàng");
                userRepository.save(customer);
            }
        };
    }
}
