package com.hirecraft.kairo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ScreeningCompleteRequest {

    private CandidateProfileDTO profile;
    private List<QA> transcript;
    private String summary;

    public CandidateProfileDTO getProfile() { return profile; }
    public void setProfile(CandidateProfileDTO v) { this.profile = v; }
    public List<QA> getTranscript() { return transcript; }
    public void setTranscript(List<QA> v) { this.transcript = v; }
    public String getSummary() { return summary; }
    public void setSummary(String v) { this.summary = v; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QA {
        private String q;
        private String a;
        public String getQ() { return q; }
        public void setQ(String v) { this.q = v; }
        public String getA() { return a; }
        public void setA(String v) { this.a = v; }
    }
}
