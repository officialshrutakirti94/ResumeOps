package com.shrutakirti.resumeops.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name="resumes")
public class ResumeMetaData {
    @Id
    private String userName;

    private int resume_id;
    private String file_name;
    private  String url;
    private String created_at;
}
