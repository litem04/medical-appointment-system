// src/main/java/com/hospital/api_gateway/config/CorsConfig.java
package com.hospital.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // CHO PHÉP CHÍNH XÁC PORT 5500 (Live Server)
        config.setAllowedOriginPatterns(List.of("http://127.0.0.1:5500"));
        // HOẶC CHO PHÉP TẤT CẢ PORT 127.0.0.1 (nếu dùng nhiều port)
        // config.setAllowedOriginPatterns(List.of("http://127.0.0.1:*"));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // Cache preflight 1 giờ

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}