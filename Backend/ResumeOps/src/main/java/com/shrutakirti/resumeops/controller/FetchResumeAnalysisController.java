package com.shrutakirti.resumeops.controller;


import com.shrutakirti.resumeops.dto.FetchAnalysisRes;
import com.shrutakirti.resumeops.dto.FetchResumeResponse;
import com.shrutakirti.resumeops.dto.ResumeAnalsysisResponse;
import com.shrutakirti.resumeops.exception.NoAnalysisException;
import com.shrutakirti.resumeops.exception.NoResumeException;
import com.shrutakirti.resumeops.service.FetchAnalysisService;
import com.shrutakirti.resumeops.service.FetchResumeService;
import com.shrutakirti.resumeops.service.ResumeCompatibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FetchResumeAnalysisController {
    @Autowired
    FetchResumeService fetchResumeService;
    @Autowired
    FetchAnalysisService fetchAnalysisService;
    @Autowired
    ResumeCompatibilityService compatibilityService;
    @GetMapping("/getAnalysisResponse")
    public List<ResumeAnalsysisResponse> getResponse() throws NoAnalysisException {
        return compatibilityService.getAnalyzedResult();
    }

    @GetMapping("/getresumes")
    public ResponseEntity<List<FetchResumeResponse>> getResume() throws NoResumeException {
        return ResponseEntity.ok(
                fetchResumeService.getResumes()
        );
    }

    @GetMapping("/getAnalysisHistory")
    public ResponseEntity<List<FetchAnalysisRes>> getAnalysis() throws NoResumeException{
        return ResponseEntity.ok(fetchAnalysisService.fetchAnalysisResList());
    }
}
