// src/main/java/com/hospital/auth/config/JwtTokenProvider.java

package com.hospital.auth.config;

import com.hospital.auth.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private Key key;  // KEY AN TOÀN

    @PostConstruct
    public void init() {
        // TẠO KEY TỪ SECRET (TỰ ĐỘNG ≥ 256 BIT)
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        System.out.println("JWT Key initialized with length: " + (jwtSecret.getBytes(StandardCharsets.UTF_8).length * 8) + " bits");
    }

    // TẠO TOKEN VỚI USER
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())           // "1"
                .claim("patientId", user.getId())              // 1 (số)
                .claim("username", user.getUsername())         // "user1"
              
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key)  // DÙNG KEY AN TOÀN
                .compact();
    }

    // LẤY USERNAME TỪ TOKEN
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // LẤY patientId TỪ TOKEN
    public Long getPatientIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("patientId", Long.class);
    }
}