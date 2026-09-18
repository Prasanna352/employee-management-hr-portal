package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.EmployeeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeDocumentRepository
        extends JpaRepository<EmployeeDocument, Long> {

    List<EmployeeDocument> findByEmployeeName(String employeeName);

    List<EmployeeDocument> findByDocumentType(String documentType);
}