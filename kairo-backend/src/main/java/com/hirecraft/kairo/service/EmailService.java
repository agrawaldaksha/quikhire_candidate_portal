package com.hirecraft.kairo.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /** True only when an SMTP username has been configured. */
    public boolean isConfigured() {
        return from != null && !from.isBlank();
    }

    /**
     * Fire-and-forget send on a background thread. NEVER runs on the request
     * thread and NEVER inside a DB transaction, so a slow SMTP handshake can't
     * hold a database connection or block the API.
     */
    @Async
    public void sendHtmlAsync(String to, String subject, String html) {
        sendHtml(to, subject, html);
    }

    /**
     * Synchronous send. Never throws: logs and returns false on any failure.
     */
    public boolean sendHtml(String to, String subject, String html) {
        if (!isConfigured()) {
            log.warn("[MAIL] SMTP not configured (spring.mail.username is blank) — skipping email to {}", to);
            return false;
        }
        if (to == null || to.isBlank()) {
            log.warn("[MAIL] no recipient address — skipping");
            return false;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("[MAIL] sent '{}' to {}", subject, to);
            return true;
        } catch (Exception e) {
            log.error("[MAIL] failed to send to {}: {}", to, e.getMessage());
            return false;
        }
    }
}
