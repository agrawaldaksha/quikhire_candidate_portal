package com.hirecraft.kairo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MemoryUpsertRequest {

    @NotBlank
    private String preferenceKey;

    @NotBlank
    private String preferenceValue;

    public String getPreferenceKey() { return preferenceKey; }
    public void setPreferenceKey(String v) { this.preferenceKey = v; }
    public String getPreferenceValue() { return preferenceValue; }
    public void setPreferenceValue(String v) { this.preferenceValue = v; }
}
