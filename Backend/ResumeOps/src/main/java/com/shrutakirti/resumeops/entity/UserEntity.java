package com.shrutakirti.resumeops.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String name;

    private String password;

    @Column(name = "google_subject", unique = true)
    private String googleSubject;

    @Enumerated(EnumType.STRING)
    private Role role= Role.USER;

    @Column(nullable = false)
    private int credits=10;

}
