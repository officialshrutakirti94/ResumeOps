package com.shrutakirti.resumeops.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FetchResumeResponse {
    private Integer resume_id;
    private String resume_name;
    private String file_name;
    private  String url;
    private String created_at;
}
