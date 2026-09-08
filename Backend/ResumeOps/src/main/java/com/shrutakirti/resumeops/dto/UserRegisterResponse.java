package com.shrutakirti.resumeops.dto;

import com.shrutakirti.resumeops.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterResponse {
    private int id;
    private String name;
    private String email;
    private Role role;
    private int credits;

}
