package com.hirecraft.kairo.service;

import com.hirecraft.kairo.dto.CandidateAuthResponse;
import com.hirecraft.kairo.dto.CandidateLoginRequest;
import com.hirecraft.kairo.dto.CandidateSignupRequest;
import com.hirecraft.kairo.model.CandidateAccount;
import com.hirecraft.kairo.model.CandidateProfile;
import com.hirecraft.kairo.repository.CandidateAccountRepository;
import com.hirecraft.kairo.repository.CandidateProfileRepository;
import com.hirecraft.kairo.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CandidateAuthService {

    private final CandidateAccountRepository accountRepo;
    private final CandidateProfileRepository profileRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final EmailService emailService;

    @Value("${app.frontend.base-url:http://localhost:5180}")
    private String frontendBaseUrl;

    public CandidateAuthService(CandidateAccountRepository accountRepo,
                                CandidateProfileRepository profileRepo,
                                PasswordEncoder passwordEncoder,
                                JwtService jwtService,
                                OtpService otpService,
                                EmailService emailService) {
        this.accountRepo = accountRepo;
        this.profileRepo = profileRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @Transactional
    public CandidateAuthResponse signup(CandidateSignupRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (accountRepo.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }
        if (!otpService.isVerified(email)) {
            throw new IllegalArgumentException("Please verify your email with the OTP first");
        }
        String candidateId = "cand_" + UUID.randomUUID().toString().replace("-", "");

        CandidateAccount account = CandidateAccount.builder()
                .candidateId(candidateId)
                .username(email)
                .email(email)
                .password(passwordEncoder.encode(req.getPassword()))
                .name(req.getName())
                .enabled(true)
                .status("ACTIVE")
                .onboardingSource(req.getSource())
                .build();
        accountRepo.save(account);

        CandidateProfile profile = CandidateProfile.builder()
                .candidateId(candidateId)
                .name(req.getName())
                .email(email)
                .headline(req.getHeadline())
                .yearsOfExperience(req.getYearsOfExperience())
                .preferredLocations(req.getPreferredLocations())
                .preferredRoles(req.getPreferredRoles())
                .skills(req.getSkills())
                .source(req.getSource())
                .profileCompleteness(0)
                .build();
        profileRepo.save(profile);

        otpService.consume(email);
        return buildAuth(account);
    }

    public CandidateAuthResponse login(CandidateLoginRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        CandidateAccount account = accountRepo.findByEmail(email).orElse(null);
        if (account == null || !Boolean.TRUE.equals(account.getEnabled())) return null;
        if (!passwordEncoder.matches(req.getPassword(), account.getPassword())) return null;
        return buildAuth(account);
    }

    /** Generate a reset token and email a reset link. Silent if the email isn't registered. */
    @Transactional
    public void forgotPassword(String rawEmail) {
        String email = rawEmail.trim().toLowerCase();
        CandidateAccount account = accountRepo.findByEmail(email).orElse(null);
        if (account == null) return; // enumeration-safe: don't reveal existence
        String token = UUID.randomUUID().toString().replace("-", "")
                + Long.toHexString(System.nanoTime());
        account.setResetToken(token);
        account.setResetTokenExpiresAt(LocalDateTime.now().plusMinutes(30));
        accountRepo.save(account);
        String link = frontendBaseUrl + "/reset-password?token=" + token;
        emailService.sendHtmlAsync(email, "Reset your Kairo password", buildResetEmail(account.getName(), link));
    }

    /** Validate the reset token and set a new password. */
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        if (token == null || token.isBlank()) return false;
        CandidateAccount account = accountRepo.findByResetToken(token).orElse(null);
        if (account == null) return false;
        if (account.getResetTokenExpiresAt() == null
                || account.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) return false;
        account.setPassword(passwordEncoder.encode(newPassword));
        account.setResetToken(null);
        account.setResetTokenExpiresAt(null);
        accountRepo.save(account);
        return true;
    }

    private CandidateAuthResponse buildAuth(CandidateAccount a) {
        String token = jwtService.generateToken(a.getUsername(), "CANDIDATE");
        return CandidateAuthResponse.builder()
                .token(token)
                .candidateId(a.getCandidateId())
                .email(a.getEmail())
                .name(a.getName())
                .role("CANDIDATE")
                .build();
    }

    private String buildResetEmail(String name, String link) {
        String first = (name == null || name.isBlank()) ? "there" : name.split(" ")[0];
        return "<!doctype html><html><body style=\"margin:0;background:#f4f7fb;font-family:Segoe UI,Helvetica,Arial,sans-serif\">"
             + "<div style=\"max-width:520px;margin:0 auto;padding:24px\">"
             + "<div style=\"background:linear-gradient(135deg,#2f6df6,#1d4ed8);border-radius:16px 16px 0 0;padding:26px 28px;color:#fff\">"
             + "<div style=\"font-size:13px;letter-spacing:2px;opacity:.85\">KAIRO</div>"
             + "<div style=\"font-size:21px;font-weight:700;margin-top:6px\">Reset your password</div>"
             + "</div>"
             + "<div style=\"background:#fff;border-radius:0 0 16px 16px;padding:28px;color:#162033;box-shadow:0 8px 30px rgba(20,32,51,.06)\">"
             + "<p style=\"font-size:15px;color:#334155;margin-top:0\">Hi " + esc(first) + ", we got a request to reset your Kairo password. Click below to choose a new one:</p>"
             + "<div style=\"text-align:center;margin:22px 0\"><a href=\"" + esc(link) + "\" style=\"display:inline-block;background:#2f6df6;color:#fff;text-decoration:none;font-weight:600;padding:13px 26px;border-radius:12px\">Reset my password</a></div>"
             + "<p style=\"font-size:13px;color:#94a3b8\">This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p>"
             + "<p style=\"font-size:12px;color:#cbd5e1;word-break:break-all\">Or paste this link: " + esc(link) + "</p>"
             + "</div></div></body></html>";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
