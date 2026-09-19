package com.shrutakirti.resumeops.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class ResumeAnalsysisResponse {
    private Integer resumeId;
    private String userName;
    private Map<String, Object> analysis;

}
