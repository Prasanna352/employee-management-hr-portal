package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.Attendance;
import com.example.employeemanagement.repository.AttendanceRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5175"
    }
)
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    public AttendanceController(
            AttendanceRepository attendanceRepository) {

        this.attendanceRepository = attendanceRepository;
    }

    // Mark attendance
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> markAttendance(
            @Valid @RequestBody Attendance attendance) {

        // Validate attendance status
        if (!attendance.getStatus().equals("PRESENT")
                && !attendance.getStatus().equals("ABSENT")) {

            return ResponseEntity
                    .badRequest()
                    .body("Status must be PRESENT or ABSENT");
        }

        // Prevent duplicate attendance for same employee and date
        if (attendanceRepository.existsByEmployeeNameAndDate(
                attendance.getEmployeeName(),
                attendance.getDate())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Attendance already marked for this employee on this date");
        }

        return ResponseEntity.ok(
                attendanceRepository.save(attendance)
        );
    }

    // Get all attendance
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceRepository.findAll()
        );
    }

    // Get attendance by employee name
    @GetMapping("/employee/{employeeName}")
    public ResponseEntity<List<Attendance>> getEmployeeAttendance(
            @PathVariable String employeeName) {

        return ResponseEntity.ok(
                attendanceRepository.findByEmployeeName(employeeName)
        );
    }

    // Get attendance by date
    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                attendanceRepository.findByDate(date)
        );
    }
}