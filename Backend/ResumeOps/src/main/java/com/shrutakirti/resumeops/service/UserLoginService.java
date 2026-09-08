package com.shrutakirti.resumeops.service;

import com.shrutakirti.resumeops.dto.UserLoginRequest;
import com.shrutakirti.resumeops.dto.UserLoginResponse;
import com.shrutakirti.resumeops.entity.UserEntity;
import com.shrutakirti.resumeops.repository.UserRepo;
import com.shrutakirti.resumeops.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserLoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    public UserLoginResponse loginService(UserLoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            UserEntity user = userRepo.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loginRequest.getEmail()));

            String token = jwtUtil.generateToken(user.getEmail());

            return new UserLoginResponse(
                    token,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getCredits()
            );
        } else {
            throw new RuntimeException("Authentication failed");
        }
    }
}
