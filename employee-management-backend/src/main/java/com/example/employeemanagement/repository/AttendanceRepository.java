package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeName(String employeeName);

    List<Attendance> findByDate(LocalDate date);

    boolean existsByEmployeeNameAndDate(
            String employeeName,
            LocalDate date
    );
}