package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.LeaveRequest;
import com.example.employeemanagement.repository.LeaveRequestRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveRequestController {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestController(
            LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> applyForLeave(
            @Valid @RequestBody LeaveRequest leaveRequest) {

        leaveRequest.setStatus("PENDING");

        return ResponseEntity.ok(
                leaveRequestRepository.save(leaveRequest)
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {

        return ResponseEntity.ok(
                leaveRequestRepository.findAll()
        );
    }

    @GetMapping("/employee/{employeeName}")
    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaves(
            @PathVariable String employeeName) {

        return ResponseEntity.ok(
                leaveRequestRepository.findByEmployeeName(employeeName)
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        LeaveRequest leaveRequest =
                leaveRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave request not found"
                                ));

        if (!status.equals("APPROVED")
                && !status.equals("REJECTED")) {

            throw new RuntimeException(
                    "Status must be APPROVED or REJECTED"
            );
        }

        leaveRequest.setStatus(status);

        return ResponseEntity.ok(
                leaveRequestRepository.save(leaveRequest)
        );
    }
}