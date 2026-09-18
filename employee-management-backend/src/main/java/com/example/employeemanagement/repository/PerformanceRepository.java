package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Performance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    List<Performance> findByEmployeeName(String employeeName);

    List<Performance> findByReviewDate(String reviewDate);
}