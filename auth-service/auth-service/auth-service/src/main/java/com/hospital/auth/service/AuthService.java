package com.hospital.auth.service;

import com.hospital.auth.config.JwtTokenProvider;
import com.hospital.auth.dto.*;
import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

//@Service
//public class AuthService {
//    private final UserRepository userRepository;
//    private final JwtService jwtService;
//    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//
//    public AuthService(UserRepository userRepository, JwtService jwtService) {
//        this.userRepository = userRepository;
//        this.jwtService = jwtService;
//    }
//
//    // ✅ Đăng ký
//    public void register(RegisterRequest request) {
//        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
//            throw new RuntimeException("Username already exists");
//        }
//
//        User user = new User();
//        user.setUsername(request.getUsername());
//        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
//
//        userRepository.save(user);
//    }
//
//    // ✅ Đăng nhập
//    public LoginResponse login(LoginRequest request) {
//        User user = userRepository.findByUsername(request.getUsername())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        // ✅ Truyền đúng kiểu User vào JwtService
//        String token = jwtService.generateToken(user);
//
//        // ✅ Trả về token cho frontend
//        return new LoginResponse(token);
//        
//    }
//}
//src/main/java/com/hospital/auth/service/AuthService.java

@Service
public class AuthService {
 private final UserRepository userRepository;
 private final JwtTokenProvider jwtTokenProvider;  // SỬA: Dùng JwtTokenProvider
 private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

 public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
     this.userRepository = userRepository;
     this.jwtTokenProvider = jwtTokenProvider;
 }

 public void register(RegisterRequest request) {
     if (userRepository.findByUsername(request.getUsername()).isPresent()) {
         throw new RuntimeException("Username already exists");
     }

     User user = new User();
     user.setUsername(request.getUsername());
     user.setPasswordHash(passwordEncoder.encode(request.getPassword()));


     userRepository.save(user);
 }

 public LoginResponse login(LoginRequest request) {
     User user = userRepository.findByUsername(request.getUsername())
             .orElseThrow(() -> new RuntimeException("User not found"));

     if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
         throw new RuntimeException("Invalid password");
     }

     // TẠO TOKEN VỚI USER
     String token = jwtTokenProvider.generateToken(user);

     // TRẢ VỀ TOKEN + patientId
     return new LoginResponse(token, user.getId(), user.getUsername());
 }
}
