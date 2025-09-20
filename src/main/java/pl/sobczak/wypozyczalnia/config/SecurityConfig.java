package pl.sobczak.wypozyczalnia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import pl.sobczak.wypozyczalnia.security.RestAccessDeniedHandler;
import pl.sobczak.wypozyczalnia.security.RestAuthenticationEntryPoint;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS dla frontu + wyłączone CSRF (REST)
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        // preflight z przeglądarki
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Swagger / OpenAPI publiczne
                        .requestMatchers("/v3/api-docs/**","/swagger-ui/**","/swagger-ui.html").permitAll()

                        // Rejestracja publiczna
                        .requestMatchers("/api/users/register").permitAll()

                        // Zasoby wymagające logowania
                        .requestMatchers("/api/devices/**").authenticated()
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

    // ✅ CORS – dopasuj originy do swojego frontu (5173 – Vite, 3000 – create-react-app)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000"
        ));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);     // wymagane gdy wysyłasz Authorization (Basic) z przeglądarki
        cfg.setMaxAge(3600L);              // cache preflight na 1h

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
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
