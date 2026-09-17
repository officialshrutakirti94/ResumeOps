package com.shrutakirti.resumeops.repository;

import com.shrutakirti.resumeops.entity.ResumeMetaData;
import com.shrutakirti.resumeops.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeRepo extends JpaRepository<ResumeMetaData,Long> {
    Optional<ResumeMetaData> findByuserName(String userName);
}
