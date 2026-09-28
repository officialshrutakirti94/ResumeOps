package com.shrutakirti.resumeops.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.shrutakirti.resumeops.dto.UserLoginResponse;
import com.shrutakirti.resumeops.entity.UserEntity;
import com.shrutakirti.resumeops.exception.UserAlreadyExistsException;
import com.shrutakirti.resumeops.repository.UserRepo;
import com.shrutakirti.resumeops.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@Service
public class GoogleLoginService {
    private final UserRepo userRepo;
    private final JwtUtil jwtUtil;
    private final String clientId;
    private final GoogleIdTokenVerifier tokenVerifier;

    public GoogleLoginService(
            UserRepo userRepo,
            JwtUtil jwtUtil,
            @Value("${google.client-id:}") String clientId) throws GeneralSecurityException, IOException {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
        this.clientId = clientId;

        GoogleIdTokenVerifier.Builder verifierBuilder = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance());
        if (!clientId.isBlank()) {
            verifierBuilder.setAudience(List.of(clientId));
        }
        this.tokenVerifier = verifierBuilder.build();
    }

    public UserLoginResponse login(String credential) {
        GoogleIdToken.Payload payload = verifyCredential(credential);
        String subject = payload.getSubject();
        String email = payload.getEmail();

        UserEntity user = userRepo.findByGoogleSubject(subject).orElseGet(() -> createGoogleUser(payload, subject, email));
        if (!user.getEmail().equalsIgnoreCase(email)) {
            throw new BadCredentialsException("Google account email does not match the linked account");
        }
        return new UserLoginResponse(
                jwtUtil.generateToken(user.getEmail()),
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCredits()
        );
    }

    @Transactional
    public void linkAccount(String credential, String authenticatedEmail) {
        GoogleIdToken.Payload payload = verifyCredential(credential);
        String googleEmail = payload.getEmail();
        if (!authenticatedEmail.equalsIgnoreCase(googleEmail)) {
            throw new BadCredentialsException("Sign in to Google with the same email as your ResumeOps account");
        }

        UserEntity user = userRepo.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user no longer exists"));
        String subject = payload.getSubject();
        userRepo.findByGoogleSubject(subject).ifPresent(linkedUser -> {
            if (linkedUser.getId() != user.getId()) {
                throw new UserAlreadyExistsException("This Google account is already linked to another user");
            }
        });
        if (user.getGoogleSubject() != null && !user.getGoogleSubject().equals(subject)) {
            throw new UserAlreadyExistsException("A different Google account is already linked to this user");
        }

        user.setGoogleSubject(subject);
        userRepo.save(user);
    }

    private GoogleIdToken.Payload verifyCredential(String credential) {
        if (clientId.isBlank()) {
            throw new IllegalStateException("Google sign-in is not configured");
        }

        GoogleIdToken idToken;
        try {
            idToken = tokenVerifier.verify(credential);
        } catch (IOException | GeneralSecurityException exception) {
            throw new BadCredentialsException("Google credential could not be verified", exception);
        }
        if (idToken == null) {
            throw new BadCredentialsException("Google credential is invalid or expired");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        if (!Boolean.TRUE.equals(payload.getEmailVerified())
                || payload.getSubject() == null
                || payload.getEmail() == null
                || payload.getEmail().isBlank()) {
            throw new BadCredentialsException("Google account must have a verified email address");
        }
        return payload;
    }

    private UserEntity createGoogleUser(GoogleIdToken.Payload payload, String subject, String email) {
        if (userRepo.existsByEmail(email)) {
            throw new UserAlreadyExistsException(
                    "An account already exists with this email. Sign in with your password before linking Google.");
        }

        UserEntity user = new UserEntity();
        user.setEmail(email);
        Object nameClaim = payload.get("name");
        user.setName(nameClaim instanceof String name && !name.isBlank()
                ? name
                : email.substring(0, email.indexOf('@')));
        user.setGoogleSubject(subject);
        return userRepo.save(user);
    }
}
