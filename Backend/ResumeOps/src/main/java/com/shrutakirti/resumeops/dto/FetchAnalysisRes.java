package com.shrutakirti.resumeops.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
@Getter
@Setter
public class FetchAnalysisRes {
    private String userName;

    private String resume_name;

    private String version;

    private Map<String,Object> analysis;
}
