package com.shrutakirti.resumeops.controller;


import com.shrutakirti.resumeops.dto.UserRegisterResponse;
import com.shrutakirti.resumeops.entity.UserEntity;
import com.shrutakirti.resumeops.service.UserRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserRegisterController {

    @Autowired
    UserRegisterService userRegisterService;

    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponse> registerUser(@Valid @RequestBody UserEntity user){
        UserEntity savedUser=userRegisterService.registerService(user);
        UserRegisterResponse res=new UserRegisterResponse();
        res.setId(savedUser.getId());
        res.setName(savedUser.getName());
        res.setEmail(savedUser.getEmail());
        res.setRole(savedUser.getRole());
        res.setCredits(savedUser.getCredits());
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
}
