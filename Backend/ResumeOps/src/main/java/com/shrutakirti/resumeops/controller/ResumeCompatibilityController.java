package com.shrutakirti.resumeops.controller;

import com.shrutakirti.resumeops.entity.ResumeCompatibilityMetaData;
import com.shrutakirti.resumeops.exception.InsufficientCreditsException;
import com.shrutakirti.resumeops.service.ResumeCompatibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class ResumeCompatibilityController {
    @Autowired
    ResumeCompatibilityService compatibilityService;



    @PostMapping("/compatibilityCheck")
        public ResumeCompatibilityMetaData compatibilityCheck(
            @RequestParam("resumeID") Integer resumeID,
            @RequestParam("JD") String JD) throws IOException, InsufficientCreditsException {
        return compatibilityService.analyze(
                resumeID,
                JD
        );
    }
}
