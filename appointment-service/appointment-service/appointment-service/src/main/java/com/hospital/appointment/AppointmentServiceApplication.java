package com.hospital.appointment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class AppointmentServiceApplication {

    @Value("${doctor.service.url}")
    private String doctorServiceUrl;

    @PostConstruct
    public void test() {
        System.out.println("Doctor URL in main: " + doctorServiceUrl);
    }
	public static void main(String[] args) {
		SpringApplication.run(AppointmentServiceApplication.class, args);
	}

}
