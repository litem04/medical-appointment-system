package com.hospital.doctor.repository;

import com.hospital.doctor.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorReponsitory extends JpaRepository<Doctor, Long> {
}
