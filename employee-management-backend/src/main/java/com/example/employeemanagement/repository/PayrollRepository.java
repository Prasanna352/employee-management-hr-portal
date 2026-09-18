package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    List<Payroll> findByEmployeeName(String employeeName);

    List<Payroll> findByPayMonth(String payMonth);

    boolean existsByEmployeeNameAndPayMonth(
            String employeeName,
            String payMonth
    );
}