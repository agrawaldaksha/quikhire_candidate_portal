package com.hirecraft.kairo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ResetPasswordRequest {
    @NotBlank
    private String token;
    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    public String getToken() { return token; }
    public void setToken(String v) { this.token = v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { this.password = v; }
}
