package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.Announcement;
import com.example.employeemanagement.repository.AnnouncementRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(
            AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    // Create announcement
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Announcement> createAnnouncement(
            @Valid @RequestBody Announcement announcement) {

        if (!announcement.getPriority().equals("LOW")
                && !announcement.getPriority().equals("MEDIUM")
                && !announcement.getPriority().equals("HIGH")) {

            throw new RuntimeException(
                    "Priority must be LOW, MEDIUM or HIGH"
            );
        }

        return ResponseEntity.ok(
                announcementRepository.save(announcement)
        );
    }

    // Get all announcements
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {

        return ResponseEntity.ok(
                announcementRepository.findAll()
        );
    }

    // Get announcements by priority
    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Announcement>> getByPriority(
            @PathVariable String priority) {

        return ResponseEntity.ok(
                announcementRepository.findByPriority(priority)
        );
    }

    // Get announcements by date
    @GetMapping("/date/{announcementDate}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Announcement>> getByDate(
            @PathVariable String announcementDate) {

        return ResponseEntity.ok(
                announcementRepository.findByAnnouncementDate(
                        announcementDate
                )
        );
    }

    // Delete announcement
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAnnouncement(
            @PathVariable Long id) {

        if (!announcementRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        announcementRepository.deleteById(id);

        return ResponseEntity.ok(
                "Announcement deleted successfully"
        );
    }
}