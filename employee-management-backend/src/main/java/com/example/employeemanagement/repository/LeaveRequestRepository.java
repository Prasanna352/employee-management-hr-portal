package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeName(String employeeName);

    List<LeaveRequest> findByStatus(String status);
}