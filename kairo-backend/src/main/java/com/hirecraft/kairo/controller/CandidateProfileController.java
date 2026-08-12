package com.hirecraft.kairo.controller;

import com.hirecraft.kairo.common.ApiResponse;
import com.hirecraft.kairo.dto.CandidateProfileDTO;
import com.hirecraft.kairo.dto.MemoryUpsertRequest;
import com.hirecraft.kairo.dto.ScreeningCompleteRequest;
import com.hirecraft.kairo.model.CandidateAccount;
import com.hirecraft.kairo.model.CandidateMemory;
import com.hirecraft.kairo.security.CandidatePrincipal;
import com.hirecraft.kairo.service.CandidateProfileService;
import com.hirecraft.kairo.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate/me")
public class CandidateProfileController {

    private final CandidateProfileService service;
    private final EmailService emailService;

    public CandidateProfileController(CandidateProfileService service, EmailService emailService) {
        this.service = service;
        this.emailService = emailService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateProfileDTO>> getProfile(@AuthenticationPrincipal CandidatePrincipal principal) {
        if (principal == null) return ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED);
        return ApiResponse.success(service.getProfile(principal.getAccount().getCandidateId()), "Profile fetched");
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateProfileDTO>> updateProfile(
            @AuthenticationPrincipal CandidatePrincipal principal,
            @RequestBody CandidateProfileDTO dto) {
        if (principal == null) return ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED);
        return ApiResponse.success(service.updateProfile(principal.getAccount().getCandidateId(), dto), "Profile updated");
    }

    @GetMapping("/memories")
    public ResponseEntity<ApiResponse<List<CandidateMemory>>> memories(@AuthenticationPrincipal CandidatePrincipal principal) {
        if (principal == null) return ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED);
        return ApiResponse.success(service.getMemories(principal.getAccount().getCandidateId()), "Memories fetched");
    }

    @PutMapping("/memories")
    public ResponseEntity<ApiResponse<CandidateMemory>> upsertMemory(
            @AuthenticationPrincipal CandidatePrincipal principal,
            @Valid @RequestBody MemoryUpsertRequest req) {
        if (principal == null) return ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED);
        return ApiResponse.success(
                service.upsertMemory(principal.getAccount().getCandidateId(), req.getPreferenceKey(), req.getPreferenceValue()),
                "Memory saved");
    }

    @PostMapping("/screening/complete")
    public ResponseEntity<ApiResponse<Map<String, Object>>> completeScreening(
            @AuthenticationPrincipal CandidatePrincipal principal,
            @RequestBody ScreeningCompleteRequest req) {
        if (principal == null) return ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED);
        CandidateAccount account = principal.getAccount();
        // 1) persist in a transaction and get the email HTML back
        String html = service.completeScreening(account, req);
        // 2) send AFTER the transaction, on a background thread (never blocks / holds a DB connection)
        boolean emailed = emailService.isConfigured();
        emailService.sendHtmlAsync(account.getEmail(), "Your Kai screening summary", html);
        return ApiResponse.success(Map.<String, Object>of("emailed", emailed),
                emailed ? "Summary saved and email queued" : "Screening saved");
    }
}
