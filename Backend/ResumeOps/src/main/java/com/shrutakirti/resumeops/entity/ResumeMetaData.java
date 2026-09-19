package com.shrutakirti.resumeops.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(
        name = "resumes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_name", "resume_name"})
        }
)
public class ResumeMetaData {

    @Column(name = "user_name")
    private String userName;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer resume_id;

    @Column(name = "resume_name")
    private String resume_name;

    @Column(name = "file_name")
    private String file_name;

    private String url;
    private String created_at;
}