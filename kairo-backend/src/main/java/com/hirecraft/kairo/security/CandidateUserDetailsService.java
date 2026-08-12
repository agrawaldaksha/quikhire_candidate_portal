package com.hirecraft.kairo.security;

import com.hirecraft.kairo.model.CandidateAccount;
import com.hirecraft.kairo.repository.CandidateAccountRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CandidateUserDetailsService implements UserDetailsService {

    private final CandidateAccountRepository repository;

    public CandidateUserDetailsService(CandidateAccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        CandidateAccount account = repository.findByUsername(username)
                .or(() -> repository.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return new CandidatePrincipal(account);
    }
}
