package com.hospital.appointment.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;


public class AppointmentResponse {
	 private Long id;
	    private Long patientId;
	    private Long doctorId;

	    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	    private LocalDateTime appointmentTime;

	    private Integer durationMinutes;
	    private String note;

	    public AppointmentResponse() {}

	    // getters + setters
	    public Long getId() { return id; }
	    public void setId(Long id) { this.id = id; }

	    public Long getPatientId() { return patientId; }
	    public void setPatientId(Long patientId) { this.patientId = patientId; }

	    public Long getDoctorId() { return doctorId; }
	    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

	    public LocalDateTime getAppointmentTime() { return appointmentTime; }
	    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

	    public Integer getDurationMinutes() { return durationMinutes; }
	    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

	    public String getNote() { return note; }
	    public void setNote(String note) { this.note = note; }
	}