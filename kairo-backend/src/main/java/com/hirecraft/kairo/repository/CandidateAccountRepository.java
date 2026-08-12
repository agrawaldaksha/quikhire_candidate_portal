package com.hirecraft.kairo.repository;

import com.hirecraft.kairo.model.CandidateAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateAccountRepository extends JpaRepository<CandidateAccount, Integer> {
    Optional<CandidateAccount> findByEmail(String email);
    Optional<CandidateAccount> findByUsername(String username);
    Optional<CandidateAccount> findByCandidateId(String candidateId);
    Optional<CandidateAccount> findByResetToken(String resetToken);
    boolean existsByEmail(String email);
}
