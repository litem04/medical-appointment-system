package com.hospital.patient.service;

import com.hospital.patient.dto.PatientCreateRequest;
import com.hospital.patient.dto.PatientResponse;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public PatientResponse createPatient(PatientCreateRequest request) {
        Patient patient = new Patient(
                request.getFullName(),
                request.getDateOfBirth(),
                request.getGender(),
                request.getPhone(),
                request.getEmail(),
                request.getAddress()
        );
        patientRepository.save(patient);
        return mapToResponse(patient);
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PatientResponse getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(this::mapToResponse)
                .orElse(null);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    private PatientResponse mapToResponse(Patient p) {
        return new PatientResponse(
                p.getId(),
                p.getFullName(),
                p.getDateOfBirth(),
                p.getGender(),
                p.getPhone(),
                p.getEmail(),
                p.getAddress()
        );
    }
}
