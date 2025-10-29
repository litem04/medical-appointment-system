package com.hospital.doctor.controller;

import com.hospital.doctor.dto.*;
import com.hospital.doctor.service.DoctorService;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {
    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    // ✅ Upload ảnh bác sĩ
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            String filePath = uploadDir + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            String fileUrl = "http://localhost:8083/" + filePath;
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi upload ảnh: " + e.getMessage());
        }
    }

    // ✅ Thêm mới bác sĩ
    @PostMapping
    public ResponseEntity<DoctorResponse> create(@RequestBody DoctorRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createDoctor(req));
    }

    // ✅ Lấy tất cả bác sĩ
    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAll() {
        return ResponseEntity.ok(service.getAllDoctors());
    }

    // ✅ Lấy 1 bác sĩ theo ID
    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDoctorById(id));
    }

    // ✅ Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<DoctorResponse> update(@PathVariable Long id, @RequestBody DoctorRequest req) {
        return ResponseEntity.ok(service.updateDoctor(id, req));
    }

    // ✅ Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        service.deactivateDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
