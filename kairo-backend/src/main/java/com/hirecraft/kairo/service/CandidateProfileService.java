package com.hirecraft.kairo.service;

import com.hirecraft.kairo.dto.CandidateProfileDTO;
import com.hirecraft.kairo.dto.ScreeningCompleteRequest;
import com.hirecraft.kairo.model.CandidateAccount;
import com.hirecraft.kairo.model.CandidateMemory;
import com.hirecraft.kairo.model.CandidateProfile;
import com.hirecraft.kairo.repository.CandidateMemoryRepository;
import com.hirecraft.kairo.repository.CandidateProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepo;
    private final CandidateMemoryRepository memoryRepo;

    public CandidateProfileService(CandidateProfileRepository profileRepo,
                                   CandidateMemoryRepository memoryRepo) {
        this.profileRepo = profileRepo;
        this.memoryRepo = memoryRepo;
    }

    public CandidateProfileDTO getProfile(String candidateId) {
        CandidateProfile p = profileRepo.findByCandidateId(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        return toDTO(p);
    }

    @Transactional
    public CandidateProfileDTO updateProfile(String candidateId, CandidateProfileDTO dto) {
        CandidateProfile p = profileRepo.findByCandidateId(candidateId)
                .orElseGet(() -> CandidateProfile.builder().candidateId(candidateId).build());
        if (dto.getName() != null) p.setName(dto.getName());
        if (dto.getEmail() != null) p.setEmail(dto.getEmail());
        if (dto.getHeadline() != null) p.setHeadline(dto.getHeadline());
        if (dto.getYearsOfExperience() != null) p.setYearsOfExperience(dto.getYearsOfExperience());
        if (dto.getPreferredLocations() != null) p.setPreferredLocations(dto.getPreferredLocations());
        if (dto.getPreferredRoles() != null) p.setPreferredRoles(dto.getPreferredRoles());
        if (dto.getSkills() != null) p.setSkills(dto.getSkills());
        if (dto.getSkillRatings() != null) p.setSkillRatings(dto.getSkillRatings());
        if (dto.getPriorities() != null) p.setPriorities(dto.getPriorities());
        if (dto.getSeniority() != null) p.setSeniority(dto.getSeniority());
        if (dto.getWorkMode() != null) p.setWorkMode(dto.getWorkMode());
        if (dto.getSalaryTarget() != null) p.setSalaryTarget(dto.getSalaryTarget());
        if (dto.getAvailability() != null) p.setAvailability(dto.getAvailability());
        if (dto.getProfileCompleteness() != null) p.setProfileCompleteness(dto.getProfileCompleteness());
        profileRepo.save(p);
        return toDTO(p);
    }

    public List<CandidateMemory> getMemories(String candidateId) {
        return memoryRepo.findByCandidateId(candidateId);
    }

    @Transactional
    public CandidateMemory upsertMemory(String candidateId, String key, String value) {
        CandidateMemory m = memoryRepo.findByCandidateIdAndPreferenceKey(candidateId, key)
                .orElseGet(() -> CandidateMemory.builder()
                        .candidateId(candidateId).preferenceKey(key).source("screening").build());
        m.setPreferenceValue(value);
        return memoryRepo.save(m);
    }

    /**
     * Persists the screening result (profile fields + transcript + summary) in a
     * single transaction and returns the ready-to-send email HTML. The actual
     * email send is done by the caller AFTER this returns, so mailing never
     * happens inside the DB transaction.
     */
    @Transactional
    public String completeScreening(CandidateAccount account, ScreeningCompleteRequest req) {
        String candidateId = account.getCandidateId();

        if (req.getProfile() != null) {
            updateProfile(candidateId, req.getProfile());
        }

        List<ScreeningCompleteRequest.QA> transcript = req.getTranscript();
        String transcriptText = renderTranscriptText(transcript);
        if (!transcriptText.isBlank()) {
            upsertMemory(candidateId, "screening_transcript", transcriptText);
        }

        String summary = (req.getSummary() != null && !req.getSummary().isBlank())
                ? req.getSummary()
                : buildSummary(req.getProfile());
        upsertMemory(candidateId, "screening_summary", summary);

        return buildEmailHtml(account.getName(), summary, req.getProfile(), transcript);
    }

    // ---------- helpers ----------

    private String renderTranscriptText(List<ScreeningCompleteRequest.QA> transcript) {
        if (transcript == null || transcript.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (ScreeningCompleteRequest.QA qa : transcript) {
            sb.append("Q: ").append(nz(qa.getQ())).append("\n");
            sb.append("A: ").append(nz(qa.getA())).append("\n\n");
        }
        return sb.toString().trim();
    }

    private String buildSummary(CandidateProfileDTO p) {
        if (p == null) return "Your Kai screening is complete.";
        StringBuilder sb = new StringBuilder("Here's what Kai learned: ");
        if (p.getSeniority() != null) sb.append(p.getSeniority()).append(" ");
        if (p.getPreferredRoles() != null && !p.getPreferredRoles().isEmpty())
            sb.append(String.join(" / ", p.getPreferredRoles())).append(" ");
        if (p.getWorkMode() != null) sb.append("· ").append(p.getWorkMode()).append(" ");
        if (p.getSalaryTarget() != null) sb.append("· target $").append(p.getSalaryTarget()).append("k ");
        return sb.toString().trim();
    }

    private String buildEmailHtml(String name, String summary, CandidateProfileDTO p,
                                  List<ScreeningCompleteRequest.QA> transcript) {
        String first = (name == null || name.isBlank()) ? "there" : name.split(" ")[0];
        StringBuilder qa = new StringBuilder();
        if (transcript != null) {
            for (ScreeningCompleteRequest.QA t : transcript) {
                qa.append("<div style=\"margin:0 0 14px\">")
                  .append("<div style=\"font-size:13px;color:#64748b\">").append(esc(t.getQ())).append("</div>")
                  .append("<div style=\"font-size:15px;color:#162033;font-weight:600\">").append(esc(t.getA())).append("</div>")
                  .append("</div>");
            }
        }
        String highlights = "";
        if (p != null) {
            highlights = row("Focus", p.getPreferredRoles() != null ? String.join(", ", p.getPreferredRoles()) : null)
                    + row("Experience", p.getYearsOfExperience() != null ? p.getYearsOfExperience() + " yrs" : null)
                    + row("Seniority", p.getSeniority())
                    + row("Work mode", p.getWorkMode())
                    + row("Target comp", p.getSalaryTarget() != null ? "$" + p.getSalaryTarget() + "k" : null)
                    + row("Skills", p.getSkills() != null ? String.join(", ", p.getSkills()) : null)
                    + row("Priorities", p.getPriorities() != null ? String.join(", ", p.getPriorities()) : null);
        }

        return "<!doctype html><html><body style=\"margin:0;background:#f4f7fb;font-family:Segoe UI,Helvetica,Arial,sans-serif\">"
             + "<div style=\"max-width:600px;margin:0 auto;padding:24px\">"
             + "<div style=\"background:linear-gradient(135deg,#2f6df6,#1d4ed8);border-radius:16px 16px 0 0;padding:28px 28px 22px;color:#fff\">"
             + "<div style=\"font-size:13px;letter-spacing:2px;opacity:.8\">KAIRO · KAI</div>"
             + "<div style=\"font-size:22px;font-weight:700;margin-top:6px\">Your screening summary, " + esc(first) + "</div>"
             + "</div>"
             + "<div style=\"background:#fff;border-radius:0 0 16px 16px;padding:26px 28px;color:#162033;box-shadow:0 8px 30px rgba(20,32,51,.06)\">"
             + "<p style=\"font-size:15px;line-height:1.6;color:#334155\">" + esc(summary) + "</p>"
             + (highlights.isBlank() ? "" : "<table style=\"width:100%;border-collapse:collapse;margin:18px 0\">" + highlights + "</table>")
             + (qa.length() == 0 ? "" : "<div style=\"font-weight:700;margin:22px 0 12px;color:#162033\">Your conversation with Kai</div>" + qa)
             + "<p style=\"font-size:13px;color:#94a3b8;margin-top:22px\">Kai is now scanning live roles for genuine fits. You'll hear from us as strong matches surface.</p>"
             + "</div>"
             + "<div style=\"text-align:center;color:#94a3b8;font-size:12px;padding:18px\">You're receiving this because you completed a Kai screening on Kairo.</div>"
             + "</div></body></html>";
    }

    private String row(String label, String value) {
        if (value == null || value.isBlank()) return "";
        return "<tr>"
             + "<td style=\"padding:7px 0;font-size:13px;color:#64748b;width:120px;vertical-align:top\">" + esc(label) + "</td>"
             + "<td style=\"padding:7px 0;font-size:14px;color:#162033;font-weight:600\">" + esc(value) + "</td>"
             + "</tr>";
    }

    private String nz(String s) { return s == null ? "" : s; }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    private CandidateProfileDTO toDTO(CandidateProfile p) {
        return CandidateProfileDTO.builder()
                .candidateId(p.getCandidateId())
                .name(p.getName())
                .email(p.getEmail())
                .headline(p.getHeadline())
                .yearsOfExperience(p.getYearsOfExperience())
                .preferredLocations(p.getPreferredLocations())
                .preferredRoles(p.getPreferredRoles())
                .skills(p.getSkills())
                .skillRatings(p.getSkillRatings())
                .priorities(p.getPriorities())
                .seniority(p.getSeniority())
                .workMode(p.getWorkMode())
                .salaryTarget(p.getSalaryTarget())
                .availability(p.getAvailability())
                .source(p.getSource())
                .profileCompleteness(p.getProfileCompleteness())
                .build();
    }
}
