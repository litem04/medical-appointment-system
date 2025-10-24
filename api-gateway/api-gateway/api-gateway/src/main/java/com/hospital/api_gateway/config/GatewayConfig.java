package com.hospital.api_gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public GlobalFilter customAuthFilter() {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getPath().toString();

            if (path.startsWith("/api/v1/auth")) {
                return chain.filter(exchange); // Bỏ qua Auth route
            }

            String token = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // (Tùy chọn) Verify JWT token ở đây...
            return chain.filter(exchange);
        };
    }
}
