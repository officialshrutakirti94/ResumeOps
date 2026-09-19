package com.shrutakirti.resumeops.service;

import com.shrutakirti.resumeops.entity.UserEntity;
import com.shrutakirti.resumeops.exception.UserAlreadyExistsException;
import com.shrutakirti.resumeops.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserRegisterService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserEntity registerService(UserEntity user){
        if(userRepo.existsByEmail(user.getEmail())){
            throw new UserAlreadyExistsException("User is already registered");
        }
        user.setName(user.getName());
        user.setEmail(user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }
}
