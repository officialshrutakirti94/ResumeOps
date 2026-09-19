package com.shrutakirti.resumeops.service;

import com.shrutakirti.resumeops.entity.ResumeCompatibilityMetaData;
import com.shrutakirti.resumeops.exception.AnalysisNotFoundException;
import com.shrutakirti.resumeops.exception.AccessDeniesException;
import com.shrutakirti.resumeops.repository.ResumeAnalysisRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class DeleteAnalysisService {
    @Autowired
    private ResumeAnalysisRepo analysisRepo;

    public void deleteAnalysis(Long analysisId) {
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

        ResumeCompatibilityMetaData analysis = analysisRepo.findById(analysisId)
            .orElseThrow(() -> new AnalysisNotFoundException("Analysis not found"));

        if (!analysis.getUserName().equals(email)) {
            throw new AccessDeniesException("Access not granted");
        }

        analysisRepo.delete(analysis);
    }
}