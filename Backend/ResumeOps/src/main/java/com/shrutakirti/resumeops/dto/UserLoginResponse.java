package com.shrutakirti.resumeops.dto;

import com.shrutakirti.resumeops.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponse {
    private String token;
    private int id;
    private String name;
    private String email;
    private Role role;
    private int credits;
}
