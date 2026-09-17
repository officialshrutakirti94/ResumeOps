package com.shrutakirti.resumeops.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class SupabaseConfig {

    @Bean
    public RestClient supabaseRestClient(
            @Value("${supabase.url}") String supabaseUrl
    ){
        return RestClient.builder().baseUrl(supabaseUrl).build();
    }

}
