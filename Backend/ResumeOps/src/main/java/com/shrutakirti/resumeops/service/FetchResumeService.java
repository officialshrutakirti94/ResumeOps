package com.shrutakirti.resumeops.service;

import com.shrutakirti.resumeops.dto.FetchResumeResponse;
import com.shrutakirti.resumeops.entity.ResumeMetaData;
import com.shrutakirti.resumeops.exception.NoResumeException;
import com.shrutakirti.resumeops.repository.ResumeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FetchResumeService {

    @Autowired
    ResumeRepo resumeRepo;

    public List<FetchResumeResponse> getResumes() throws NoResumeException {

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

        List<ResumeMetaData> data = resumeRepo.findByUserName(email);

        if (data.isEmpty()) {
            throw new NoResumeException();
        }

        List<FetchResumeResponse> responses = new ArrayList<>();

        for (ResumeMetaData resume : data) {

            FetchResumeResponse res = new FetchResumeResponse();

            res.setResume_id(resume.getResume_id());
            res.setResume_name(resume.getResume_name());
            res.setUrl(resume.getUrl());
            res.setFile_name(resume.getFile_name());
            res.setCreated_at(resume.getCreated_at());

            responses.add(res);
        }

        return responses;
    }
}