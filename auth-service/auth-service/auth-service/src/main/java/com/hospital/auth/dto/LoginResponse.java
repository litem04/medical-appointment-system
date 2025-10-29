package com.hospital.auth.dto;

//src/main/java/com/hospital/auth/dto/LoginResponse.java

public class LoginResponse {
 private String token;
 private Long patientId;
 private String userName;

 // SỬA CONSTRUCTOR
 public LoginResponse(String token, Long patientId, String userName) {
     this.token = token;
     this.patientId = patientId;
     this.userName = userName;
 }

 // Getters & Setters
 public String getToken() { return token; }
 public void setToken(String token) { this.token = token; }

 public Long getPatientId() { return patientId; }
 public void setPatientId(Long patientId) { this.patientId = patientId; }

 public String getUserName() { return userName; }
 public void setUserName(String userName) { this.userName = userName; }
}