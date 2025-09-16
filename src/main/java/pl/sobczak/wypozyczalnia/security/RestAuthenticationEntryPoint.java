package pl.sobczak.wypozyczalnia.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.*;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import java.util.Map;

public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        try {
            var body = Map.of(
                    "komunikat", "Brak uwierzytelnienia. Zaloguj się, aby uzyskać dostęp.",
                    "sciezka", request.getRequestURI()
            );
            mapper.writeValue(response.getOutputStream(), body);
        } catch (Exception ignored) {}
    }
}
