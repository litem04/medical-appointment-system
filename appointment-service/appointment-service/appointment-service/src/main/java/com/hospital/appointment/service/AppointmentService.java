package com.hospital.appointment.service;

import com.hospital.appointment.dto.AppointmentCreateRequest;
import com.hospital.appointment.dto.AppointmentResponse;
import com.hospital.appointment.model.Appointment;
import com.hospital.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;
    private final WebClient doctorWebClient;
    private final WebClient patientWebClient;

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public AppointmentService(AppointmentRepository repo,
                              WebClient doctorWebClient,
                              WebClient patientWebClient) {
        this.repo = repo;
        this.doctorWebClient = doctorWebClient;
        this.patientWebClient = patientWebClient;
    }

    // 🩺 Tạo lịch hẹn mới
    public AppointmentResponse create(AppointmentCreateRequest req) {
     //   LocalDateTime startTime = req.getAppointmentTime();
    	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    	LocalDateTime startTime = LocalDateTime.parse(req.getAppointmentTime(), formatter);

        Appointment appointment = new Appointment();
        appointment.setDoctorId(req.getDoctorId());
        appointment.setPatientId(req.getPatientId());
        appointment.setAppointmentTime(startTime);
        appointment.setDurationMinutes(req.getDurationMinutes() != null ? req.getDurationMinutes() : 30);
        appointment.setStatus("BOOKED");
        appointment.setNote(req.getNote());

        Appointment saved = repo.save(appointment);
        return toResponse(saved);
    }

    // 📋 Lấy danh sách lịch hẹn theo bác sĩ
    public List<AppointmentResponse> getByDoctor(Long doctorId) {
        return repo.findByDoctorIdOrderByAppointmentTimeDesc(doctorId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 📋 Lấy danh sách lịch hẹn theo bệnh nhân
    public List<AppointmentResponse> getByPatient(Long patientId) {
        return repo.findByPatientIdOrderByAppointmentTimeDesc(patientId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 🧩 Chuyển Entity → DTO (đúng định dạng ISO)
    private AppointmentResponse toResponse(Appointment a) {
        AppointmentResponse r = new AppointmentResponse();
        r.setAppointmentId(a.getId());
        r.setDoctorId(a.getDoctorId());
        r.setPatientId(a.getPatientId());
        r.setAppointmentTime(a.getAppointmentTime() != null
                ? a.getAppointmentTime().format(formatter)
                : null);
        r.setDurationMinutes(a.getDurationMinutes());
        r.setStatus(a.getStatus());
        r.setNote(a.getNote());
        return r;
    }
}
