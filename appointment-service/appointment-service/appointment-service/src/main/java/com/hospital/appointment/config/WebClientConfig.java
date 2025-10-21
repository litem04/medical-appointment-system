package com.hospital.appointment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;


@Configuration
public class WebClientConfig {

    @Value("${doctor.service.url}")
    private String doctorServiceUrl;

    @Value("${patient.service.url}")
    private String patientServiceUrl;

    @Bean
    public WebClient doctorWebClient() {
        return WebClient.builder()
                .baseUrl(doctorServiceUrl)
                .build();
    }

    @Bean
    public WebClient patientWebClient() {
        return WebClient.builder()
                .baseUrl(patientServiceUrl)
                .build();
    }
}
