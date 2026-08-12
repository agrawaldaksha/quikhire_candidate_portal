package com.hirecraft.kairo.repository;

import com.hirecraft.kairo.model.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Integer> {
    Optional<CandidateProfile> findByCandidateId(String candidateId);
}
