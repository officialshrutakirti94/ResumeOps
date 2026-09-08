package com.shrutakirti.resumeops.controller;

import com.shrutakirti.resumeops.dto.UserLoginRequest;
import com.shrutakirti.resumeops.dto.UserLoginResponse;
import com.shrutakirti.resumeops.service.UserLoginService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserLoginController {

    @Autowired
    private UserLoginService userLoginService;

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> loginUser(@Valid @RequestBody UserLoginRequest loginRequest) {
        UserLoginResponse loginResponse = userLoginService.loginService(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }
}
