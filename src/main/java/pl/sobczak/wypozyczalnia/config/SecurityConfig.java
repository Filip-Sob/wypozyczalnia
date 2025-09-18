package pl.sobczak.wypozyczalnia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import pl.sobczak.wypozyczalnia.security.RestAccessDeniedHandler;
import pl.sobczak.wypozyczalnia.security.RestAuthenticationEntryPoint;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // REST API -> CSRF wyłączamy
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Swagger / OpenAPI publiczne
                        .requestMatchers("/v3/api-docs/**","/swagger-ui/**","/swagger-ui.html").permitAll()
                        // Rejestracja publiczna
                        .requestMatchers("/api/users/register").permitAll()
                        // Zarządzanie sprzętem tylko dla ADMIN/STAFF
                        .requestMatchers("/api/devices/**").authenticated()
                        // Wypożyczenia i rezerwacje wymagają zalogowania
                        .requestMatchers("/api/loans/**","/api/reservations/**").authenticated()
                        // reszta też wymaga zalogowania
                        .anyRequest().authenticated()
                )
                // HTTP Basic
                .httpBasic(Customizer.withDefaults())
                // Własne polskie odpowiedzi 401/403
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                        .accessDeniedHandler(new RestAccessDeniedHandler())
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
