package com.hirecraft.kairo.security;

import com.hirecraft.kairo.model.CandidateAccount;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CandidatePrincipal implements UserDetails {

    private final CandidateAccount account;

    public CandidatePrincipal(CandidateAccount account) {
        this.account = account;
    }

    public CandidateAccount getAccount() {
        return account;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("CANDIDATE"));
    }

    @Override public String getPassword() { return account.getPassword(); }
    @Override public String getUsername() { return account.getUsername(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return Boolean.TRUE.equals(account.getEnabled()); }
}
