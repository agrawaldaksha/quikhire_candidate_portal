package com.hirecraft.kairo.service;

import com.hirecraft.kairo.model.EmailOtp;
import com.hirecraft.kairo.repository.CandidateAccountRepository;
import com.hirecraft.kairo.repository.EmailOtpRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int TTL_MINUTES = 10;

    private final EmailOtpRepository otpRepo;
    private final CandidateAccountRepository accountRepo;
    private final EmailService emailService;

    public OtpService(EmailOtpRepository otpRepo, CandidateAccountRepository accountRepo, EmailService emailService) {
        this.otpRepo = otpRepo;
        this.accountRepo = accountRepo;
        this.emailService = emailService;
    }

    /** Generate + email a fresh code for signup verification. */
    @Transactional
    public void requestOtp(String rawEmail) {
        String email = normalize(rawEmail);
        if (accountRepo.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists. Please log in instead.");
        }
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        EmailOtp otp = otpRepo.findByEmail(email).orElseGet(() -> {
            EmailOtp o = new EmailOtp();
            o.setEmail(email);
            return o;
        });
        otp.setCode(code);
        otp.setVerified(false);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(TTL_MINUTES));
        otpRepo.save(otp);
        emailService.sendHtmlAsync(email, "Your Kairo verification code", buildOtpEmail(code));
    }

    /** Returns true if the code matches and hasn't expired; marks the OTP verified. */
    @Transactional
    public boolean verifyOtp(String rawEmail, String rawCode) {
        String email = normalize(rawEmail);
        String code = rawCode == null ? "" : rawCode.trim();
        EmailOtp otp = otpRepo.findByEmail(email).orElse(null);
        if (otp == null) return false;
        if (otp.getExpiresAt() == null || otp.getExpiresAt().isBefore(LocalDateTime.now())) return false;
        if (!otp.getCode().equals(code)) return false;
        otp.setVerified(true);
        otpRepo.save(otp);
        return true;
    }

    /** True if this email has a verified, unexpired OTP (gate for signup). */
    public boolean isVerified(String rawEmail) {
        String email = normalize(rawEmail);
        return otpRepo.findByEmail(email)
                .filter(o -> Boolean.TRUE.equals(o.getVerified()))
                .filter(o -> o.getExpiresAt() != null && o.getExpiresAt().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    /** Remove the OTP once the account is created. */
    @Transactional
    public void consume(String rawEmail) {
        otpRepo.findByEmail(normalize(rawEmail)).ifPresent(otpRepo::delete);
    }

    private String normalize(String e) {
        return e == null ? "" : e.trim().toLowerCase();
    }

    private String buildOtpEmail(String code) {
        return "<!doctype html><html><body style=\"margin:0;background:#f4f7fb;font-family:Segoe UI,Helvetica,Arial,sans-serif\">"
             + "<div style=\"max-width:520px;margin:0 auto;padding:24px\">"
             + "<div style=\"background:linear-gradient(135deg,#2f6df6,#1d4ed8);border-radius:16px 16px 0 0;padding:26px 28px;color:#fff\">"
             + "<div style=\"font-size:13px;letter-spacing:2px;opacity:.85\">KAIRO</div>"
             + "<div style=\"font-size:21px;font-weight:700;margin-top:6px\">Verify your email</div>"
             + "</div>"
             + "<div style=\"background:#fff;border-radius:0 0 16px 16px;padding:28px;color:#162033;box-shadow:0 8px 30px rgba(20,32,51,.06)\">"
             + "<p style=\"font-size:15px;color:#334155;margin-top:0\">Use this code to finish creating your Kairo account:</p>"
             + "<div style=\"font-size:34px;font-weight:800;letter-spacing:10px;color:#1d4ed8;text-align:center;margin:20px 0;padding:14px;background:#eef4ff;border-radius:12px\">" + code + "</div>"
             + "<p style=\"font-size:13px;color:#94a3b8\">This code expires in " + TTL_MINUTES + " minutes. If you didn't request it, you can ignore this email.</p>"
             + "</div></div></body></html>";
    }
}
