package com.hospital.doctor.controller;

import com.hospital.doctor.dto.*;
import com.hospital.doctor.service.DoctorService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {
	   private final DoctorService service;

	    public DoctorController(DoctorService service) {
	        this.service = service;
	    }

	    @PostMapping
	    public ResponseEntity<DoctorResponse> create(@RequestBody DoctorRequest req) {
	        return ResponseEntity.status(HttpStatus.CREATED).body(service.createDoctor(req));
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<DoctorResponse> getById(@PathVariable Long id) {
	        return ResponseEntity.ok(service.getDoctorById(id));
	    }

	    @GetMapping
	    public ResponseEntity<List<DoctorResponse>> getAll() {
	        return ResponseEntity.ok(service.getAllDoctors());
	    }

	    @PutMapping("/{id}")
	    public ResponseEntity<DoctorResponse> update(@PathVariable Long id, @RequestBody DoctorRequest req) {
	        return ResponseEntity.ok(service.updateDoctor(id, req));
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
	        service.deactivateDoctor(id);
	        return ResponseEntity.noContent().build();
	    }
}
