package com.hirecraft.kairo.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "kairo_candidate_memories",
        uniqueConstraints = @UniqueConstraint(columnNames = {"candidate_id", "preference_key"}))
public class CandidateMemory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private String candidateId;

    @Column(name = "preference_key", nullable = false, length = 100)
    private String preferenceKey;

    @Column(name = "preference_value", nullable = false, columnDefinition = "text")
    private String preferenceValue;

    private String source;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CandidateMemory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String v) { this.candidateId = v; }
    public String getPreferenceKey() { return preferenceKey; }
    public void setPreferenceKey(String v) { this.preferenceKey = v; }
    public String getPreferenceValue() { return preferenceValue; }
    public void setPreferenceValue(String v) { this.preferenceValue = v; }
    public String getSource() { return source; }
    public void setSource(String v) { this.source = v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final CandidateMemory m = new CandidateMemory();
        public Builder candidateId(String v) { m.candidateId = v; return this; }
        public Builder preferenceKey(String v) { m.preferenceKey = v; return this; }
        public Builder preferenceValue(String v) { m.preferenceValue = v; return this; }
        public Builder source(String v) { m.source = v; return this; }
        public CandidateMemory build() { return m; }
    }
}
