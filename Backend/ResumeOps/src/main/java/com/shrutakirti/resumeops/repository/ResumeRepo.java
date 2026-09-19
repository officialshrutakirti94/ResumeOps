package com.shrutakirti.resumeops.repository;

import com.shrutakirti.resumeops.entity.ResumeMetaData;
import com.shrutakirti.resumeops.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepo extends JpaRepository<ResumeMetaData,Integer> {
    List<ResumeMetaData> findByUserName(String userName);
}
