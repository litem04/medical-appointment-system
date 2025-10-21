package com.hospital.appointment.dto;

public class AppointmentCreateRequest {
	
	    private Long patientId;
	    private Long doctorId;
	    private String appointmentTime; // ISO-8601, e.g. "2025-10-01T03:00:00Z"
	    private Integer durationMinutes; // optional, default 30
	    private String note;

	    // getters & setters
	    public Long getPatientId() { return patientId; }
	    public void setPatientId(Long patientId) { this.patientId = patientId; }
	    public Long getDoctorId() { return doctorId; }
	    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
	    public String getAppointmentTime() { return appointmentTime; }
	    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }
	    public Integer getDurationMinutes() { return durationMinutes; }
	    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
	    public String getNote() { return note; }
	    public void setNote(String note) { this.note = note; }
	
}
