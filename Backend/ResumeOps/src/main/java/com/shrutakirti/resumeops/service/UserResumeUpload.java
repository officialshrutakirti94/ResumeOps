package com.shrutakirti.resumeops.service;

import com.shrutakirti.resumeops.dto.ResumeUploadResponse;
import com.shrutakirti.resumeops.entity.ResumeMetaData;
import com.shrutakirti.resumeops.repository.ResumeRepo;
import com.shrutakirti.resumeops.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authorization.method.AuthorizeReturnObject;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalTime;
import java.util.UUID;

@Service
public class UserResumeUpload {

    @Autowired
    SupabaseStorageService storageService;

    @Autowired
    ResumeRepo repo;

    public ResumeMetaData upload(MultipartFile file,String resume_name) throws IOException {
        Object principal= SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        System.out.println(email);
        ResumeMetaData metaData=new ResumeMetaData();
        String file_name= UUID.randomUUID()+".tex";

        String url=email+"/"+file_name;

        storageService.upload(url,file);

        metaData.setUserName(email);
        metaData.setUrl(url);
        metaData.setFile_name(file_name);
        metaData.setCreated_at(LocalTime.now().toString());
        metaData.setResume_name(resume_name);
        ResumeMetaData data=repo.save(metaData);
        System.out.println("Generated Resume ID: " + data.getResume_id());
        return data;

    }
}
