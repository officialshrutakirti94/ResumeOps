package com.shrutakirti.resumeops.controller;

import com.shrutakirti.resumeops.service.DeleteResumeHistory;
import com.shrutakirti.resumeops.service.DeleteAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeleteController {
    @Autowired
    DeleteResumeHistory deleteResumeHistory;
    @Autowired
    DeleteAnalysisService deleteAnalysisService;

    @DeleteMapping("/analysisDelete/{analysisId}")
    public ResponseEntity<?> deleteAnalysis(@PathVariable Long analysisId){
        deleteAnalysisService.deleteAnalysis(analysisId);
        return ResponseEntity.ok("Analysis successfully deleted");
    }

    @DeleteMapping("/resumeDelete/{resumeID}")
    public ResponseEntity<?> deleteResume(@PathVariable Integer resumeID){
        deleteResumeHistory.deleteResume(resumeID);
        return ResponseEntity.ok("Resume successfully deleted");
    }
}
