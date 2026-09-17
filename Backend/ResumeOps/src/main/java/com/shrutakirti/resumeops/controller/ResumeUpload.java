package com.shrutakirti.resumeops.controller;


import com.shrutakirti.resumeops.dto.ResumeUploadResponse;
import com.shrutakirti.resumeops.entity.ResumeMetaData;
import com.shrutakirti.resumeops.service.UserResumeUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/resume")
public class ResumeUpload {

    @Autowired
    UserResumeUpload resumeService;
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeUploadResponse> uploadResume(@RequestParam("resume") MultipartFile file, Authentication authentication) throws IOException {

        System.out.println("=========Resume Upload===========");
        System.out.println(authentication.getName());
        ResumeUploadResponse res=new ResumeUploadResponse();
        ResumeMetaData resume= resumeService.upload(file);

        res.setFile_name(resume.getFile_name());
        res.setUrl(resume.getUrl());
        res.setUser_name(resume.getUserName());
        res.setCreated_at(resume.getCreated_at());

        return ResponseEntity.ok(res);

    }
}
