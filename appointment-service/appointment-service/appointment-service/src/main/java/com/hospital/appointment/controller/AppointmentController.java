//package com.hospital.appointment.controller;
//
//import com.hospital.appointment.dto.*;
//import com.hospital.appointment.service.AppointmentService;
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/appointments")
//public class AppointmentController {
//
//    private final AppointmentService service;
//
//    public AppointmentController(AppointmentService service) {
//        this.service = service;
//    }
//
//    @PostMapping
//    public ResponseEntity<AppointmentResponse> create(@RequestBody AppointmentCreateRequest req) {
//        AppointmentResponse res = service.create(req);
//        return ResponseEntity.status(HttpStatus.CREATED).body(res);	
//    }
//
//    @GetMapping("/doctor/{doctorId}")
//    public ResponseEntity<List<AppointmentResponse>> getByDoctor(@PathVariable Long doctorId) {
//        return ResponseEntity.ok(service.getByDoctor(doctorId));
//    }
//}

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
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
   

    // THÊM MỚI: LẤY LỊCH CỦA BỆNH NHÂN
    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @RequestParam("patientId") Long patientId) {
        
        if (patientId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        List<AppointmentResponse> list = service.getByPatientId(patientId);
        return ResponseEntity.ok(list);
    }

    
}
