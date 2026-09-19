package com.shrutakirti.resumeops.exception;

public class DuplicateResumeNameException extends RuntimeException {
    public DuplicateResumeNameException(String message) {
        super(message);
    }
}