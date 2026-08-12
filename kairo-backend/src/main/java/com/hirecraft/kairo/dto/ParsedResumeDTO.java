package com.hirecraft.kairo.dto;

import java.util.List;

public class ParsedResumeDTO {
    private String name;
    private String email;
    private String phone;
    private String headline;
    private String location;
    private List<String> skills;

    public ParsedResumeDTO() {}

    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getHeadline() { return headline; }
    public void setHeadline(String v) { this.headline = v; }
    public String getLocation() { return location; }
    public void setLocation(String v) { this.location = v; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> v) { this.skills = v; }
}
