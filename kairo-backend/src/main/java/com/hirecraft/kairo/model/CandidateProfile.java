package com.hirecraft.kairo.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "kairo_candidate_profiles")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "candidate_id", nullable = false, unique = true)
    private String candidateId;

    private String name;
    private String email;
    private String headline;

    @Column(name = "years_of_experience")
    private BigDecimal yearsOfExperience;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "preferred_locations", columnDefinition = "text[]")
    private List<String> preferredLocations;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "preferred_roles", columnDefinition = "text[]")
    private List<String> preferredRoles;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "skills", columnDefinition = "text[]")
    private List<String> skills;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "priorities", columnDefinition = "text[]")
    private List<String> priorities;

    private String seniority;

    @Column(name = "work_mode")
    private String workMode;

    @Column(name = "salary_target")
    private Integer salaryTarget;

    private String availability;
    private String source;

    @Column(name = "profile_completeness")
    private Integer profileCompleteness;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CandidateProfile() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String v) { this.candidateId = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getHeadline() { return headline; }
    public void setHeadline(String v) { this.headline = v; }
    public BigDecimal getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(BigDecimal v) { this.yearsOfExperience = v; }
    public List<String> getPreferredLocations() { return preferredLocations; }
    public void setPreferredLocations(List<String> v) { this.preferredLocations = v; }
    public List<String> getPreferredRoles() { return preferredRoles; }
    public void setPreferredRoles(List<String> v) { this.preferredRoles = v; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> v) { this.skills = v; }
    public List<String> getPriorities() { return priorities; }
    public void setPriorities(List<String> v) { this.priorities = v; }
    public String getSeniority() { return seniority; }
    public void setSeniority(String v) { this.seniority = v; }
    public String getWorkMode() { return workMode; }
    public void setWorkMode(String v) { this.workMode = v; }
    public Integer getSalaryTarget() { return salaryTarget; }
    public void setSalaryTarget(Integer v) { this.salaryTarget = v; }
    public String getAvailability() { return availability; }
    public void setAvailability(String v) { this.availability = v; }
    public String getSource() { return source; }
    public void setSource(String v) { this.source = v; }
    public Integer getProfileCompleteness() { return profileCompleteness; }
    public void setProfileCompleteness(Integer v) { this.profileCompleteness = v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final CandidateProfile p = new CandidateProfile();
        public Builder candidateId(String v) { p.candidateId = v; return this; }
        public Builder name(String v) { p.name = v; return this; }
        public Builder email(String v) { p.email = v; return this; }
        public Builder headline(String v) { p.headline = v; return this; }
        public Builder yearsOfExperience(BigDecimal v) { p.yearsOfExperience = v; return this; }
        public Builder preferredLocations(List<String> v) { p.preferredLocations = v; return this; }
        public Builder preferredRoles(List<String> v) { p.preferredRoles = v; return this; }
        public Builder skills(List<String> v) { p.skills = v; return this; }
        public Builder priorities(List<String> v) { p.priorities = v; return this; }
        public Builder seniority(String v) { p.seniority = v; return this; }
        public Builder workMode(String v) { p.workMode = v; return this; }
        public Builder salaryTarget(Integer v) { p.salaryTarget = v; return this; }
        public Builder availability(String v) { p.availability = v; return this; }
        public Builder source(String v) { p.source = v; return this; }
        public Builder profileCompleteness(Integer v) { p.profileCompleteness = v; return this; }
        public CandidateProfile build() { return p; }
    }
}
