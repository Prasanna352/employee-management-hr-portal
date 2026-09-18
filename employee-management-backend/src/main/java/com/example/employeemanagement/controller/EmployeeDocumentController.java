package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.EmployeeDocument;
import com.example.employeemanagement.repository.EmployeeDocumentRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeDocumentController {

    private final EmployeeDocumentRepository documentRepository;

    public EmployeeDocumentController(
            EmployeeDocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    // Add employee document
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<EmployeeDocument> addDocument(
            @Valid @RequestBody EmployeeDocument document) {

        return ResponseEntity.ok(
                documentRepository.save(document)
        );
    }

    // Get all employee documents
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<EmployeeDocument>> getAllDocuments() {

        return ResponseEntity.ok(
                documentRepository.findAll()
        );
    }

    // Get documents by employee
    @GetMapping("/employee/{employeeName}")
    public ResponseEntity<List<EmployeeDocument>> getDocumentsByEmployee(
            @PathVariable String employeeName) {

        return ResponseEntity.ok(
                documentRepository.findByEmployeeName(employeeName)
        );
    }

    // Get documents by document type
    @GetMapping("/type/{documentType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<EmployeeDocument>> getDocumentsByType(
            @PathVariable String documentType) {

        return ResponseEntity.ok(
                documentRepository.findByDocumentType(documentType)
        );
    }

    // Delete employee document
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Long id) {

        if (!documentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        documentRepository.deleteById(id);

        return ResponseEntity.ok(
                "Employee document deleted successfully"
        );
    }
}