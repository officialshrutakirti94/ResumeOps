package com.shrutakirti.resumeops.exception;

import com.shrutakirti.resumeops.dto.ErrorResponse;
import com.shrutakirti.resumeops.service.NoResumeFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(
            UserNotFoundException exception, HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage(), request);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleSpringUserNotFound(
            UsernameNotFoundException exception, HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage(), request);
    }

    @ExceptionHandler({AnalysisNotFoundException.class, NoResumeFoundException.class})
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            RuntimeException exception, HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage(), request);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(
            UserAlreadyExistsException exception, HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, exception.getMessage(), request);
    }

    @ExceptionHandler(DuplicateResumeNameException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResumeName(
            DuplicateResumeNameException exception, HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, exception.getMessage(), request);
    }

    @ExceptionHandler({PasswordMismatchException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleInvalidPassword(
            RuntimeException exception, HttpServletRequest request) {
        return error(HttpStatus.UNAUTHORIZED, exception.getMessage(), request);
    }

    @ExceptionHandler(InsufficientCreditsException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientCredits(
            InsufficientCreditsException exception, HttpServletRequest request) {
        return error(HttpStatus.PAYMENT_REQUIRED, exception.getMessage(), request);
    }

    @ExceptionHandler({NoAnalysisException.class, NoResumeException.class})
    public ResponseEntity<ErrorResponse> handleEmptyResource(
            Exception exception, HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage(), request);
    }

    @ExceptionHandler(AccessDeniesException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniesException exception, HttpServletRequest request) {
        return error(HttpStatus.FORBIDDEN, exception.getMessage(), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException exception, HttpServletRequest request) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .orElse("Invalid request");
        return error(HttpStatus.BAD_REQUEST, message, request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException exception, HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, "The request conflicts with existing data", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(
            Exception exception, HttpServletRequest request) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request);
    }

    private ResponseEntity<ErrorResponse> error(
            HttpStatus status, String message, HttpServletRequest request) {
        ErrorResponse response = new ErrorResponse(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(response);
    }
}