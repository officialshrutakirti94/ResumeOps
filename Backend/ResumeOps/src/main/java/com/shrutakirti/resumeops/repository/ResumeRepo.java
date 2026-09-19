package com.shrutakirti.resumeops.repository;

import com.shrutakirti.resumeops.entity.ResumeMetaData;
import com.shrutakirti.resumeops.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepo extends JpaRepository<ResumeMetaData,Integer> {
    List<ResumeMetaData> findByUserName(String userName);

    @Query("SELECT COUNT(resume) > 0 FROM ResumeMetaData resume " +
            "WHERE resume.userName = :userName AND resume.resume_name = :resumeName")
    boolean existsByUserNameAndResumeName(
            @Param("userName") String userName,
            @Param("resumeName") String resumeName);
}
