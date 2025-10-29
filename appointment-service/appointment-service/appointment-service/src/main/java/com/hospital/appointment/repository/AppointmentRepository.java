package com.hospital.appointment.repository;

import java.util.List;
import com.hospital.appointment.model.Appointment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

	

    List<Appointment> findByPatientIdOrderByAppointmentTimeDesc(Long patientId);


	  
}
