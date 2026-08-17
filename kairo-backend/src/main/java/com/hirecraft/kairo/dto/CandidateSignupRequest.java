package com.hirecraft.kairo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CandidateSignupRequest {

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String name;
    private String source;

    private String headline;
    private BigDecimal yearsOfExperience;
    private List<String> preferredLocations;
    private List<String> preferredRoles;
    private List<String> skills;

    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { this.password = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getSource() { return source; }
    public void setSource(String v) { this.source = v; }
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
}
