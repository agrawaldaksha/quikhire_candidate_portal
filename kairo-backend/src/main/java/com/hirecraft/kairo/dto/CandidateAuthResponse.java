package com.hirecraft.kairo.dto;

public class CandidateAuthResponse {

    private String token;
    private String candidateId;
    private String email;
    private String name;
    private String role;

    public CandidateAuthResponse() {}

    public String getToken() { return token; }
    public void setToken(String v) { this.token = v; }
    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String v) { this.candidateId = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getRole() { return role; }
    public void setRole(String v) { this.role = v; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final CandidateAuthResponse r = new CandidateAuthResponse();
        public Builder token(String v) { r.token = v; return this; }
        public Builder candidateId(String v) { r.candidateId = v; return this; }
        public Builder email(String v) { r.email = v; return this; }
        public Builder name(String v) { r.name = v; return this; }
        public Builder role(String v) { r.role = v; return this; }
        public CandidateAuthResponse build() { return r; }
    }
}
