package com.shrutakirti.resumeops.service;


import com.shrutakirti.resumeops.config.WebClientConfig;
import com.shrutakirti.resumeops.dto.ResumeAnalsysisResponse;
import com.shrutakirti.resumeops.entity.ResumeCompatibilityMetaData;
import com.shrutakirti.resumeops.entity.ResumeMetaData;
import com.shrutakirti.resumeops.entity.UserEntity;
import com.shrutakirti.resumeops.exception.InsufficientCreditsException;
import com.shrutakirti.resumeops.exception.NoAnalysisException;
import com.shrutakirti.resumeops.exception.AccessDeniesException;
import com.shrutakirti.resumeops.exception.AnalysisServiceUnavailableException;
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
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ResumeCompatibilityService {

    @Autowired
    private ResumeAnalysisRepo analysisRepo;

    @Autowired
    CreditsManager creditsManager;

    @Autowired
    private UserRepo repo;

    private final WebClient fastApiClient;

    ResumeCompatibilityService(WebClient fastApiClient){
        this.fastApiClient=fastApiClient;
    }

//    @Autowired
//    ResumeAnalysisRepo analysisRepo;
    @Autowired
    ResumeRepo resumeRepo;

    @Autowired
    SupabaseStorageService storageService;
    public ResumeCompatibilityMetaData analyze(Integer resumeId,String jobJD) throws IOException, InsufficientCreditsException {
        Object principal= SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if(principal instanceof UserDetails){
            email=((UserDetails) principal).getUsername();
        }else{
            email=principal.toString();
        }



        ResumeMetaData resume = resumeRepo.findById(resumeId)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Resume not found with id: " + resumeId
                ));
        UserEntity user=repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        if (!resume.getUserName().equals(email)) {
            throw new AccessDeniesException("You are not allowed to access this resume");
        }

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
        String version=getVersion(resume.getResume_id());
        analysisReport.setVersion(version);
        analysisReport.setResume_name(resume.getResume_name());
        user.setCredits(creditsManager.decrement(user.getCredits()));
        repo.save(user);
        analysisRepo.save(analysisReport);

        return analysisReport;
    }

    public String getVersion(Integer resume_id){
        Optional<ResumeCompatibilityMetaData> data_version=analysisRepo.findFirstByResume_idOrderByAnalysis_idDesc(resume_id);
        if(data_version.isEmpty()){
            return "v1";
        }
        String version=data_version.get().getVersion();
        int versionNumber=Integer.parseInt(version.substring(1));
        return "v"+(versionNumber+1);
    }

    public Map<String,Object> analyzeResumeApiRequest(byte[] filebytes,String fileName,String jobDescription){
        MultipartBodyBuilder builder=new MultipartBodyBuilder();
        builder.part("file",filebytes).filename(fileName).contentType(MediaType.APPLICATION_OCTET_STREAM);
        builder.part("jd", jobDescription);
        try {
            return fastApiClient.post().uri("/resume/matchJD")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .onStatus(
                    HttpStatusCode::isError,
                    response -> response.bodyToMono(String.class)
                        .flatMap(errorBody -> Mono.error(
                            new AnalysisServiceUnavailableException(
                                "Resume analysis service returned an error: " + errorBody,
                                null)
                        ))
                )
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block(Duration.ofSeconds(90));
        } catch (AnalysisServiceUnavailableException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new AnalysisServiceUnavailableException(
                "Resume analysis service is unavailable. Check FASTAPI_BASE_URL.",
                exception
            );
        }
    }



    public List<ResumeAnalsysisResponse> getAnalyzedResult() throws NoAnalysisException {

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

        List<ResumeCompatibilityMetaData> analysisMetadata =
                analysisRepo.findByUserName(email);

        if (analysisMetadata.isEmpty()) {
            throw new NoAnalysisException("Analysis not found");
        }

        return analysisMetadata.stream()
                .map(analysis -> {
                    ResumeAnalsysisResponse res = new ResumeAnalsysisResponse();

                    res.setResumeId(analysis.getResume_id());
                    res.setUserName(analysis.getUserName());
                    res.setAnalysis(analysis.getAnalysis());

                    return res;
                })
                .toList();
    }


}
