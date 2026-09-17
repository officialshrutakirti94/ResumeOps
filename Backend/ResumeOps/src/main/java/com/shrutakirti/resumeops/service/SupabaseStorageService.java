package com.shrutakirti.resumeops.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    private final RestClient supabaseRestClient;

    @Value("${supabase.service-key}")
    private String serviceKey;

    @Value("${supabase.bucket}")
    private String bucket;

    public void upload(
            String storagePath,
            MultipartFile file
    ) throws IOException {

        String endpoint =
                "/storage/v1/object/"
                        + bucket
                        + "/"
                        + storagePath;

        supabaseRestClient
                .post()
                .uri(endpoint)
                .header("apikey", serviceKey)
                .header("Authorization", "Bearer " + serviceKey)
                .contentType(
                        MediaType.parseMediaType(
                                file.getContentType()
                        )
                )
                .body(file.getBytes())
                .retrieve()
                .toBodilessEntity();
    }

    public byte[] download(String storagePath) throws IOException{
        String endpoint =
                "/storage/v1/object/"
                        + bucket
                        + "/"
                        + storagePath;

        return supabaseRestClient
                .get()
                .uri(endpoint)
                .header("apikey",serviceKey)
                .header("Authorization","Bearer "+serviceKey)
                .retrieve()
                .body(byte[].class);
    }
}