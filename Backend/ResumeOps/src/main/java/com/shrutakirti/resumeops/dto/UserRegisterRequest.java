package com.shrutakirti.resumeops.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String name;

    @NotBlank
    @Size(min = 8)
    private String password;
}
