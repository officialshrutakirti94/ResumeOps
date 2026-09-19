package com.shrutakirti.resumeops.service;


import com.shrutakirti.resumeops.dto.FetchResumeResponse;
import com.shrutakirti.resumeops.entity.ResumeMetaData;

import com.shrutakirti.resumeops.exception.AccessDeniesException;
import com.shrutakirti.resumeops.repository.ResumeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class DeleteResumeHistory {
    @Autowired
    ResumeRepo repo;
    public void deleteResume(Integer resumeID){
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        ResumeMetaData resume=repo.findById(resumeID).orElseThrow(()->new NoResumeFoundException("No resume found"));
        if(!resume.getUserName().equals(email)){
            throw new AccessDeniesException("Access not granted");
        }

        repo.delete(resume);

    }
}
