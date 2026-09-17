package com.shrutakirti.resumeops.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResumeUploadResponse {
    private String user_name;
    private int resume_id;
    private String file_name;
    private  String url;
    private String created_at;

}
