package com.shrutakirti.resumeops.repository;

import com.shrutakirti.resumeops.entity.ResumeCompatibilityMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeAnalysisRepo extends JpaRepository<ResumeCompatibilityMetaData,Long> {
}
