package com.hirecraft.kairo.repository;

import com.hirecraft.kairo.model.CandidateMemory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateMemoryRepository extends JpaRepository<CandidateMemory, Long> {
    List<CandidateMemory> findByCandidateId(String candidateId);
    Optional<CandidateMemory> findByCandidateIdAndPreferenceKey(String candidateId, String preferenceKey);
}
