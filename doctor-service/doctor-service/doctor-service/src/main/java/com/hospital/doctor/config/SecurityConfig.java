package com.hospital.doctor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	 @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        http
	            .csrf(csrf -> csrf.disable()) // Tắt CSRF cho phép upload form
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/api/v1/doctors/upload").permitAll() // ✅ Cho phép public
	                .requestMatchers("/api/v1/doctors/**").permitAll() // ✅ Cho phép tất cả endpoint doctor
	                .anyRequest().permitAll()
	            )
	            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
	        return http.build();
	    }
}
