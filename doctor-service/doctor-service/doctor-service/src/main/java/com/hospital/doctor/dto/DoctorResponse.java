package com.hospital.doctor.dto;

public class DoctorResponse {
	  private Long id;
	    private String fullName;
	    private String specialization;
	    private String phone;
	    private String email;
	    private Boolean active;

	    public Long getId() { return id; }
	    public void setId(Long id) { this.id = id; }

	    public String getFullName() { return fullName; }
	    public void setFullName(String fullName) { this.fullName = fullName; }

	    public String getSpecialization() { return specialization; }
	    public void setSpecialization(String specialization) { this.specialization = specialization; }

	    public String getPhone() { return phone; }
	    public void setPhone(String phone) { this.phone = phone; }

	    public String getEmail() { return email; }
	    public void setEmail(String email) { this.email = email; }

	    public Boolean getActive() { return active; }
	    public void setActive(Boolean active) { this.active = active; }
}
