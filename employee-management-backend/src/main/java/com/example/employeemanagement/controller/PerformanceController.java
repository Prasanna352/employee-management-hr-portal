package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.Performance;
import com.example.employeemanagement.repository.PerformanceRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "http://localhost:5173")
public class PerformanceController {

    private final PerformanceRepository performanceRepository;

    public PerformanceController(
            PerformanceRepository performanceRepository) {
        this.performanceRepository = performanceRepository;
    }

    // Add performance review
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Performance> addPerformance(
            @Valid @RequestBody Performance performance) {

        if (performance.getRating() < 1
                || performance.getRating() > 5) {

            throw new RuntimeException(
                    "Rating must be between 1 and 5"
            );
        }

        return ResponseEntity.ok(
                performanceRepository.save(performance)
        );
    }

    // Get all performance reviews
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Performance>> getAllPerformance() {

        return ResponseEntity.ok(
                performanceRepository.findAll()
        );
    }

    // Get performance by employee
    @GetMapping("/employee/{employeeName}")
    public ResponseEntity<List<Performance>> getPerformanceByEmployee(
            @PathVariable String employeeName) {

        return ResponseEntity.ok(
                performanceRepository.findByEmployeeName(employeeName)
        );
    }

    // Get performance by review date
    @GetMapping("/date/{reviewDate}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Performance>> getPerformanceByDate(
            @PathVariable String reviewDate) {

        return ResponseEntity.ok(
                performanceRepository.findByReviewDate(reviewDate)
        );
    }

    // Delete performance review
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePerformance(
            @PathVariable Long id) {

        if (!performanceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        performanceRepository.deleteById(id);

        return ResponseEntity.ok(
                "Performance review deleted successfully"
        );
    }
}