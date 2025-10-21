package com.hospital.appointment.dto;

public class AppointmentResponse {
	 private Long appointmentId;
	    private Long patientId;
	    private Long doctorId;
	    private String appointmentTime; // ISO
	    private Integer durationMinutes;
	    private String status;
	    private String note;
	    public Long getAppointmentId() { return appointmentId; }
	    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

	    public Long getPatientId() { return patientId; }
	    public void setPatientId(Long patientId) { this.patientId = patientId; }

	    public Long getDoctorId() { return doctorId; }
	    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

	    public String getAppointmentTime() { return appointmentTime; }
	    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }

	    public Integer getDurationMinutes() { return durationMinutes; }
	    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

	    public String getStatus() { return status; }
	    public void setStatus(String status) { this.status = status; }

	    public String getNote() { return note; }
	    public void setNote(String note) { this.note = note; }
	    
	    
}
