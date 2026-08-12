package com.hirecraft.kairo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OtpVerifyRequest {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String code;
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getCode() { return code; }
    public void setCode(String v) { this.code = v; }
}
