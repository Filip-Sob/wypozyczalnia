package pl.sobczak.wypozyczalnia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // REST API -> CSRF wyłączamy
                .csrf(AbstractHttpConfigurer::disable)
                // (opcjonalnie) CORS jeśli front na innym porcie
                //.cors(Customizer.withDefaults())

                .authorizeHttpRequests(auth -> auth
                        // Na czas dev możesz zostawić publiczne users, ale rozważ ograniczenie później
                        .requestMatchers("/api/users/**").permitAll()

                        // Devices: GET dla zalogowanych, POST też dla zalogowanych (możemy potem zmienić na ADMIN)
                        .requestMatchers(HttpMethod.GET,  "/api/devices/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/devices/**").authenticated()

                        // Reszta też wymaga logowania
                        .anyRequest().authenticated()
                )
                // HTTP Basic
                .httpBasic(basic -> {});

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
