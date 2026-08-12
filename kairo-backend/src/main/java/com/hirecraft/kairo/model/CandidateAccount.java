package com.hirecraft.kairo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "kairo_candidate_accounts")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CandidateAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "candidate_id", nullable = false, unique = true)
    private String candidateId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean enabled = true;

    private String name;

    private String status = "ACTIVE";

    @Column(name = "onboarding_source")
    private String onboardingSource;

    @JsonIgnore
    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expires_at")
    private LocalDateTime resetTokenExpiresAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CandidateAccount() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOnboardingSource() { return onboardingSource; }
    public void setOnboardingSource(String onboardingSource) { this.onboardingSource = onboardingSource; }
    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public LocalDateTime getResetTokenExpiresAt() { return resetTokenExpiresAt; }
    public void setResetTokenExpiresAt(LocalDateTime v) { this.resetTokenExpiresAt = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final CandidateAccount a = new CandidateAccount();
        public Builder candidateId(String v) { a.candidateId = v; return this; }
        public Builder username(String v) { a.username = v; return this; }
        public Builder email(String v) { a.email = v; return this; }
        public Builder password(String v) { a.password = v; return this; }
        public Builder enabled(Boolean v) { a.enabled = v; return this; }
        public Builder name(String v) { a.name = v; return this; }
        public Builder status(String v) { a.status = v; return this; }
        public Builder onboardingSource(String v) { a.onboardingSource = v; return this; }
        public CandidateAccount build() { return a; }
    }
}
