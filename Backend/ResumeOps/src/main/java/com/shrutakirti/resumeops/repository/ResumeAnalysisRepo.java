package com.shrutakirti.resumeops.repository;

import com.shrutakirti.resumeops.entity.ResumeCompatibilityMetaData;
import com.shrutakirti.resumeops.entity.ResumeMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeAnalysisRepo extends JpaRepository<ResumeCompatibilityMetaData, Long> {

    List<ResumeCompatibilityMetaData> findByUserName(String userName);

    @Query("SELECT r FROM ResumeCompatibilityMetaData r " +
            "WHERE r.resume_id = :resumeId " +
            "ORDER BY r.analysis_id DESC")
    Optional<ResumeCompatibilityMetaData> findLatestByResumeId(@Param("resumeId") Integer resumeId);
}
