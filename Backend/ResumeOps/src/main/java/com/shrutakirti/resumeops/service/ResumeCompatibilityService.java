package com.shrutakirti.resumeops.service;


import com.shrutakirti.resumeops.config.WebClientConfig;
import com.shrutakirti.resumeops.entity.ResumeCompatibilityMetaData;
import com.shrutakirti.resumeops.entity.ResumeMetaData;
import com.shrutakirti.resumeops.entity.UserEntity;
import com.shrutakirti.resumeops.exception.InsufficientCreditsException;
import com.shrutakirti.resumeops.repository.ResumeAnalysisRepo;
import com.shrutakirti.resumeops.repository.ResumeRepo;
import com.shrutakirti.resumeops.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserter;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
public class ResumeCompatibilityService {

    @Autowired
    CreditsManager creditsManager;

    @Autowired
    private UserRepo repo;

    private final WebClient fastApiClient;

    ResumeCompatibilityService(WebClient fastApiClient){
        this.fastApiClient=fastApiClient;
    }

    @Autowired
    ResumeAnalysisRepo analysisRepo;
    @Autowired
    ResumeRepo resumeRepo;

    @Autowired
    SupabaseStorageService storageService;
    public ResumeCompatibilityMetaData analyze(String jobJD) throws IOException, InsufficientCreditsException {
        Object principal= SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if(principal instanceof UserDetails){
            email=((UserDetails) principal).getUsername();
        }else{
            email=principal.toString();
        }



        ResumeMetaData resume=resumeRepo.findByuserName(email).orElseThrow(()->new UsernameNotFoundException("User not found with email :"+ email));
        UserEntity user=repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if(user.getCredits()<=0){
            throw new InsufficientCreditsException("Insufficient Credits");
        }


        byte[] filebytes=storageService.download(resume.getUrl());
        String fileName= resume.getFile_name();
        Map<String,Object> analysisResponse=analyzeResumeApiRequest(filebytes,fileName,jobJD);

        ResumeCompatibilityMetaData analysisReport=new ResumeCompatibilityMetaData();
        analysisReport.setUserName(resume.getUserName());
//        String version= resume.get;
//        int vers=Integer.parseInt(version.substring(1));
//        vers++;
//        String newString="v"+vers;
//        analysisReport.setVersion(newString);
        analysisReport.setResume_id(resume.getResume_id());
        analysisReport.setAnalysis(analysisResponse);
        user.setCredits(creditsManager.decrement(user.getCredits()));
        repo.save(user);
        analysisRepo.save(analysisReport);

        return analysisReport;
    }

    public Map<String,Object> analyzeResumeApiRequest(byte[] filebytes,String fileName,String jobDescription){
        MultipartBodyBuilder builder=new MultipartBodyBuilder();
        builder.part("file",filebytes).filename(fileName).contentType(MediaType.APPLICATION_OCTET_STREAM);
        builder.part("jd", jobDescription);
        return fastApiClient.post().uri("/resume/matchJD")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .onStatus(
                        HttpStatusCode::isError,
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    System.out.println("FASTAPI ERROR: " + errorBody);
                                    return Mono.error(
                                            new RuntimeException(errorBody)
                                    );
                                })
                )
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }


}
