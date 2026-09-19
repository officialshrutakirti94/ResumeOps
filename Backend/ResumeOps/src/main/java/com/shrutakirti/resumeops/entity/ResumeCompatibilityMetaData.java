package com.shrutakirti.resumeops.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Getter
@Setter
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"resume_id", "version"}
                )
        }
)
public class ResumeCompatibilityMetaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long analysis_id;

    private String userName;


    private Integer resume_id;

    private String resume_name;

    private String version;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String,Object> analysis;
}
