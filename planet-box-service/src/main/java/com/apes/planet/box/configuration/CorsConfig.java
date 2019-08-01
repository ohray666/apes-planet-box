package com.apes.planet.box.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

  @Bean
  public CorsConfiguration corsConfiguration() {
    CorsConfiguration corsConfiguration = new CorsConfiguration();
    corsConfiguration.addAllowedHeader("*");
    corsConfiguration.addAllowedOrigin("*");
    corsConfiguration.addAllowedMethod("*");
    return corsConfiguration;
  }

  @Bean
  public CorsFilter corsFilter(CorsConfiguration corsConfiguration) {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);
    return new CorsFilter(source);
  }

}