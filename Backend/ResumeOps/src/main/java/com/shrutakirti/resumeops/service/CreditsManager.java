package com.shrutakirti.resumeops.service;

import org.springframework.stereotype.Service;

@Service
public class CreditsManager {
    public int increment(int credits){
        credits+=2;
        return credits;
    }
    public int decrement(int credits){
        credits-=2;
        return credits;
    }
}
