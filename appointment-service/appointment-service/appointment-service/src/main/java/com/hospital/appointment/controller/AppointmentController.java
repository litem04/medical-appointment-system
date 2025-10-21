package com.hospital.appointment.controller;

import com.hospital.appointment.dto.*;
import com.hospital.appointment.service.AppointmentService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(@RequestBody AppointmentCreateRequest req) {
        AppointmentResponse res = service.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);	
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(service.getByDoctor(doctorId));
    }
}