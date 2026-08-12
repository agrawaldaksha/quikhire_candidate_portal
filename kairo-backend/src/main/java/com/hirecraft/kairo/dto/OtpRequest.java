package com.hirecraft.kairo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OtpRequest {
    @NotBlank @Email
    private String email;
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
}
