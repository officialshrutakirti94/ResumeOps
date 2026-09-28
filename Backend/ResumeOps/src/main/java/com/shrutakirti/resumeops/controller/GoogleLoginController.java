package com.shrutakirti.resumeops.controller;

import com.shrutakirti.resumeops.dto.GoogleLoginRequest;
import com.shrutakirti.resumeops.dto.UserLoginResponse;
import com.shrutakirti.resumeops.service.GoogleLoginService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class GoogleLoginController {
    private final GoogleLoginService googleLoginService;

    public GoogleLoginController(GoogleLoginService googleLoginService) {
        this.googleLoginService = googleLoginService;
    }

    @PostMapping("/google")
    public ResponseEntity<UserLoginResponse> loginWithGoogle(
            @Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(googleLoginService.login(request.getCredential()));
    }

    @PostMapping("/google/link")
    public ResponseEntity<Void> linkGoogleAccount(
            @Valid @RequestBody GoogleLoginRequest request,
            Authentication authentication) {
        googleLoginService.linkAccount(request.getCredential(), authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
