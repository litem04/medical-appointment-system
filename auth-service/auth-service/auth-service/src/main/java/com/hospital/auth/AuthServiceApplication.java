package com.hospital.auth;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class AuthServiceApplication {
	   @PostConstruct
	    public void init() {
	        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	    }
	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

}
