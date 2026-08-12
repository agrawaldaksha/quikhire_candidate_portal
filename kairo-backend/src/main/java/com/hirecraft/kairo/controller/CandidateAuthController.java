package com.hirecraft.kairo.controller;

import com.hirecraft.kairo.common.ApiResponse;
import com.hirecraft.kairo.dto.CandidateAuthResponse;
import com.hirecraft.kairo.dto.CandidateLoginRequest;
import com.hirecraft.kairo.dto.CandidateSignupRequest;
import com.hirecraft.kairo.dto.ForgotPasswordRequest;
import com.hirecraft.kairo.dto.OtpRequest;
import com.hirecraft.kairo.dto.OtpVerifyRequest;
import com.hirecraft.kairo.dto.ParsedResumeDTO;
import com.hirecraft.kairo.dto.ResetPasswordRequest;
import com.hirecraft.kairo.service.CandidateAuthService;
import com.hirecraft.kairo.service.OtpService;
import com.hirecraft.kairo.service.ResumeParseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/candidate/auth")
public class CandidateAuthController {

    private final CandidateAuthService service;
    private final OtpService otpService;
    private final ResumeParseService resumeParseService;

    public CandidateAuthController(CandidateAuthService service, OtpService otpService,
                                   ResumeParseService resumeParseService) {
        this.service = service;
        this.otpService = otpService;
        this.resumeParseService = resumeParseService;
    }

    // ----- resume parsing (onboarding pre-fill) -----

    @PostMapping(value = "/parse-resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ParsedResumeDTO>> parseResume(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ApiResponse.error("No file received", HttpStatus.BAD_REQUEST);
        }
        try {
            return ApiResponse.success(resumeParseService.parse(file), "Resume parsed");
        } catch (Exception e) {
            return ApiResponse.error("Couldn't read that file. Please fill your details in manually.",
                    HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    // ----- signup email verification (OTP) -----

    @PostMapping("/otp/request")
    public ResponseEntity<ApiResponse<Object>> requestOtp(@Valid @RequestBody OtpRequest req) {
        try {
            otpService.requestOtp(req.getEmail());
            return ApiResponse.success(null, "Verification code sent");
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<Object>> verifyOtp(@Valid @RequestBody OtpVerifyRequest req) {
        boolean ok = otpService.verifyOtp(req.getEmail(), req.getCode());
        if (!ok) return ApiResponse.error("The verification code is invalid or has expired", HttpStatus.BAD_REQUEST);
        return ApiResponse.success(null, "Email verified");
    }

    // ----- signup / login -----

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<CandidateAuthResponse>> signup(@Valid @RequestBody CandidateSignupRequest req) {
        try {
            return ApiResponse.success(service.signup(req), "Signup successful", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<CandidateAuthResponse>> login(@Valid @RequestBody CandidateLoginRequest req) {
        CandidateAuthResponse r = service.login(req);
        if (r == null) {
            return ApiResponse.error("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }
        return ApiResponse.success(r, "Login successful");
    }

    // ----- forgot / reset password -----

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Object>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        service.forgotPassword(req.getEmail());
        return ApiResponse.success(null, "If that email is registered, a reset link is on its way");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        boolean ok = service.resetPassword(req.getToken(), req.getPassword());
        if (!ok) return ApiResponse.error("This reset link is invalid or has expired", HttpStatus.BAD_REQUEST);
        return ApiResponse.success(null, "Password updated — you can now log in");
    }
}
