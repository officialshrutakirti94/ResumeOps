package com.shrutakirti.resumeops.service;

public class NoResumeFoundException extends RuntimeException {
    public NoResumeFoundException(String message) {
        super(message);
    }
}
