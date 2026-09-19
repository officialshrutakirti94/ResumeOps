package com.shrutakirti.resumeops.service;

import com.shrutakirti.resumeops.dto.FetchAnalysisRes;
import com.shrutakirti.resumeops.entity.ResumeCompatibilityMetaData;
import com.shrutakirti.resumeops.exception.NoResumeException;
import com.shrutakirti.resumeops.repository.ResumeAnalysisRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FetchAnalysisService {

    @Autowired
    private ResumeAnalysisRepo analysisRepo;
    public List<FetchAnalysisRes> fetchAnalysisResList() throws NoResumeException {
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
        List<ResumeCompatibilityMetaData> data=analysisRepo.findByUserName(email);
        if(data.isEmpty()){
            throw new NoResumeException();
        }
        List<FetchAnalysisRes> response = new ArrayList<>();
        for(ResumeCompatibilityMetaData resumeAnalysis:data){
            FetchAnalysisRes res=new FetchAnalysisRes();
            res.setAnalysis_id(resumeAnalysis.getAnalysis_id());
            res.setAnalysis(resumeAnalysis.getAnalysis());
            res.setVersion(resumeAnalysis.getVersion());
            res.setUserName(resumeAnalysis.getUserName());
            res.setResume_name(resumeAnalysis.getResume_name());
            response.add(res);
        }
        return response;

    }
}
