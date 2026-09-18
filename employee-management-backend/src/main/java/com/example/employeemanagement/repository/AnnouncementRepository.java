package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository
        extends JpaRepository<Announcement, Long> {

    List<Announcement> findByPriority(String priority);

    List<Announcement> findByAnnouncementDate(String announcementDate);
}