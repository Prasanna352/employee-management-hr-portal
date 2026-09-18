package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.Payroll;
import com.example.employeemanagement.repository.PayrollRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:5173")
public class PayrollController {

    private final PayrollRepository payrollRepository;

    public PayrollController(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }

    // Add payroll
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Payroll> addPayroll(
            @Valid @RequestBody Payroll payroll) {

        // Calculate net salary
        double netSalary =
                payroll.getBasicSalary()
                + payroll.getAllowances()
                - payroll.getDeductions();

        payroll.setNetSalary(netSalary);

        // Prevent duplicate payroll for same employee and month
        if (payrollRepository.existsByEmployeeNameAndPayMonth(
                payroll.getEmployeeName(),
                payroll.getPayMonth())) {

            throw new RuntimeException(
                    "Payroll already exists for this employee for this month"
            );
        }

        return ResponseEntity.ok(
                payrollRepository.save(payroll)
        );
    }

    // Get all payroll records
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Payroll>> getAllPayroll() {

        return ResponseEntity.ok(
                payrollRepository.findAll()
        );
    }

    // Get payroll by employee
    @GetMapping("/employee/{employeeName}")
    public ResponseEntity<List<Payroll>> getPayrollByEmployee(
            @PathVariable String employeeName) {

        return ResponseEntity.ok(
                payrollRepository.findByEmployeeName(employeeName)
        );
    }

    // Get payroll by month
    @GetMapping("/month/{payMonth}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Payroll>> getPayrollByMonth(
            @PathVariable String payMonth) {

        return ResponseEntity.ok(
                payrollRepository.findByPayMonth(payMonth)
        );
    }

    // Delete payroll
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePayroll(
            @PathVariable Long id) {

        if (!payrollRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        payrollRepository.deleteById(id);

        return ResponseEntity.ok(
                "Payroll deleted successfully"
        );
    }
}