//package com.hospital.appointment.service;
//
//import com.hospital.appointment.dto.AppointmentCreateRequest;
//import com.hospital.appointment.dto.AppointmentResponse;
//import com.hospital.appointment.model.Appointment;
//import com.hospital.appointment.repository.AppointmentRepository;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class AppointmentService {
//
//    private final AppointmentRepository repo;
//    private final WebClient doctorWebClient;
//    private final WebClient patientWebClient;
//
//    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
//
//    public AppointmentService(AppointmentRepository repo,
//                              WebClient doctorWebClient,
//                              WebClient patientWebClient) {
//        this.repo = repo;
//        this.doctorWebClient = doctorWebClient;
//        this.patientWebClient = patientWebClient;
//    }
//
//    // 🩺 Tạo lịch hẹn mới
//    public AppointmentResponse create(AppointmentCreateRequest req) {
//     //   LocalDateTime startTime = req.getAppointmentTime();
//    	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
//    	LocalDateTime startTime = LocalDateTime.parse(req.getAppointmentTime(), formatter);
//
//        Appointment appointment = new Appointment();
//        appointment.setDoctorId(req.getDoctorId());
//        appointment.setPatientId(req.getPatientId());
//        
//        appointment.setDurationMinutes(req.getDurationMinutes() != null ? req.getDurationMinutes() : 30);
//        
//        appointment.setNote(req.getNote());
//
//        Appointment saved = repo.save(appointment);
//        return toResponse(saved);
//    }
//
//    // 📋 Lấy danh sách lịch hẹn theo bác sĩ
//    public List<AppointmentResponse> getByDoctor(Long doctorId) {
//        return repo.findByDoctorIdOrderByAppointmentTimeDesc(doctorId)
//                .stream()
//                .map(this::toResponse)
//                .collect(Collectors.toList());
//    }
//
//    // 📋 Lấy danh sách lịch hẹn theo bệnh nhân
//    public List<AppointmentResponse> getByPatient(Long patientId) {
//        return repo.findByPatientIdOrderByAppointmentTimeDesc(patientId)
//                .stream()
//                .map(this::toResponse)
//                .collect(Collectors.toList());
//    }
//
//    // 🧩 Chuyển Entity → DTO (đúng định dạng ISO)
//    private AppointmentResponse toResponse(Appointment a) {
//        AppointmentResponse r = new AppointmentResponse();
//        r.setAppointmentId(a.getId());
//        r.setDoctorId(a.getDoctorId());
//        r.setPatientId(a.getPatientId());
//        r.setAppointmentTime(a.getAppointmentTime() != null
//                ? a.getAppointmentTime().format(formatter)
//                : null);
//        r.setDurationMinutes(a.getDurationMinutes());
//        
//        r.setNote(a.getNote());
//        return r;
//    }
//}

package com.hospital.appointment.service;

import com.hospital.appointment.dto.*;
import com.hospital.appointment.model.Appointment;
import com.hospital.appointment.repository.AppointmentRepository;

import lombok.Builder;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    public AppointmentResponse create(AppointmentCreateRequest req) {
        if (req.getPatientId() == null || req.getDoctorId() == null || req.getAppointmentTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu thông tin bắt buộc (patientId, doctorId, appointmentTime)");
        }

        Appointment a = new Appointment();
        a.setPatientId(req.getPatientId());
        a.setDoctorId(req.getDoctorId());
        a.setAppointmentTime(req.getAppointmentTime());
        a.setDurationMinutes(req.getDurationMinutes());
        a.setNote(req.getNote());

        Appointment saved = repo.save(a);

        AppointmentResponse res = new AppointmentResponse();
        res.setId(saved.getId());
        res.setPatientId(saved.getPatientId());
        res.setDoctorId(saved.getDoctorId());
        res.setAppointmentTime(saved.getAppointmentTime());
        res.setDurationMinutes(saved.getDurationMinutes());
        res.setNote(saved.getNote());
        return res;
    }
   
    public List<AppointmentResponse> getAll() {
        return repo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AppointmentResponse getById(Long id) {
        Appointment a = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lịch"));
        return toResponse(a);
    }
 // === THÊM VÀO AppointmentService.java ===
    public List<AppointmentResponse> getByPatientId(Long patientId) {
        if (patientId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "patientId không được để trống");
        }
        return repo.findByPatientIdOrderByAppointmentTimeDesc(patientId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AppointmentResponse toResponse(Appointment a) {
        AppointmentResponse r = new AppointmentResponse();
        r.setId(a.getId());
        r.setPatientId(a.getPatientId());
        r.setDoctorId(a.getDoctorId());
        r.setAppointmentTime(a.getAppointmentTime());
        r.setDurationMinutes(a.getDurationMinutes());
        r.setNote(a.getNote());
        return r;
    }
}