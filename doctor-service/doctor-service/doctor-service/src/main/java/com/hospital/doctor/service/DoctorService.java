package com.hospital.doctor.service;

import com.hospital.doctor.dto.*;
import com.hospital.doctor.model.Doctor;
import com.hospital.doctor.repository.DoctorReponsitory;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;



@Service
public class DoctorService {

	 private final DoctorReponsitory repo;

    public DoctorService(DoctorReponsitory repo) {
        this.repo = repo;
    }

    public DoctorResponse createDoctor(DoctorRequest req) {
        if (req.getFullName() == null || req.getFullName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên bác sĩ là bắt buộc");
        }

        if (req.getSpecialization() == null || req.getSpecialization().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chuyên khoa là bắt buộc");
        }

        Doctor doctor = new Doctor();
  
        doctor.setFullName(req.getFullName());
        doctor.setSpecialization(req.getSpecialization());
        doctor.setPhone(req.getPhone());
        doctor.setEmail(req.getEmail());
        doctor.setImageUrl(req.getImageUrl());
        doctor.setActive(true);

        Doctor saved = repo.save(doctor);
        return toResponse(saved);
    }

    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bác sĩ"));
        return toResponse(doctor);
    }

    public List<DoctorResponse> getAllDoctors() {
        return repo.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DoctorResponse updateDoctor(Long id, DoctorRequest req) {
        Doctor doctor = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bác sĩ"));

        if (req.getFullName() != null) doctor.setFullName(req.getFullName());
        if (req.getSpecialization() != null) doctor.setSpecialization(req.getSpecialization());
        if (req.getPhone() != null) doctor.setPhone(req.getPhone());
        if (req.getEmail() != null) doctor.setEmail(req.getEmail());
        if (req.getImageUrl() != null) doctor.setImageUrl(req.getImageUrl());

        Doctor updated = repo.save(doctor);
        return toResponse(updated);
    }

    public void deactivateDoctor(Long id) {
        Doctor doctor = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bác sĩ"));
        doctor.setActive(false);
        repo.save(doctor);
    }

    private DoctorResponse toResponse(Doctor d) {
        DoctorResponse r = new DoctorResponse();
        
        r.setId(d.getId());
        r.setFullName(d.getFullName());
        r.setSpecialization(d.getSpecialization());
        r.setPhone(d.getPhone());
        r.setEmail(d.getEmail());
        r.setImageUrl(d.getImageUrl());
        r.setActive(d.getActive());
        return r;
    }
}
