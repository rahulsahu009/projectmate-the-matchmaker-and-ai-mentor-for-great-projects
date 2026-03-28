package com.projectmate.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private boolean isTeamFinalized = false;

    private boolean isCompleted = false;

    private boolean isActive = true;

    private String requiredSkills; // comma-separated

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id")
    @JsonIgnoreProperties({ "password" }) // simple way to avoid exposing password
    private User createdBy;

    @Column(columnDefinition = "TEXT")
    private String aiRoadmap;

    private String githubRepoUrl;

    private String status = "PENDING";

    private Integer progressPercentage = 0;

    @Column(columnDefinition = "TEXT")
    private String aiProgressNotes;

    private String lastCommitSha;
}
