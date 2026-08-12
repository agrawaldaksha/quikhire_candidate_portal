package com.hirecraft.kairo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CandidateProfileDTO {

    private String candidateId;
    private String name;
    private String email;
    private String headline;
    private BigDecimal yearsOfExperience;
    private List<String> preferredLocations;
    private List<String> preferredRoles;
    private List<String> skills;
    private List<String> priorities;
    private String seniority;
    private String workMode;
    private Integer salaryTarget;
    private String availability;
    private String source;
    private Integer profileCompleteness;

    public CandidateProfileDTO() {}

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

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final CandidateProfileDTO d = new CandidateProfileDTO();
        public Builder candidateId(String v) { d.candidateId = v; return this; }
        public Builder name(String v) { d.name = v; return this; }
        public Builder email(String v) { d.email = v; return this; }
        public Builder headline(String v) { d.headline = v; return this; }
        public Builder yearsOfExperience(BigDecimal v) { d.yearsOfExperience = v; return this; }
        public Builder preferredLocations(List<String> v) { d.preferredLocations = v; return this; }
        public Builder preferredRoles(List<String> v) { d.preferredRoles = v; return this; }
        public Builder skills(List<String> v) { d.skills = v; return this; }
        public Builder priorities(List<String> v) { d.priorities = v; return this; }
        public Builder seniority(String v) { d.seniority = v; return this; }
        public Builder workMode(String v) { d.workMode = v; return this; }
        public Builder salaryTarget(Integer v) { d.salaryTarget = v; return this; }
        public Builder availability(String v) { d.availability = v; return this; }
        public Builder source(String v) { d.source = v; return this; }
        public Builder profileCompleteness(Integer v) { d.profileCompleteness = v; return this; }
        public CandidateProfileDTO build() { return d; }
    }
}
