package pl.sobczak.wypozyczalnia.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.*;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import java.util.Map;

public class RestAccessDeniedHandler implements AccessDeniedHandler {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        try {
            var body = Map.of(
                    "komunikat", "Brak uprawnień do wykonania tej operacji.",
                    "sciezka", request.getRequestURI()
            );
            mapper.writeValue(response.getOutputStream(), body);
        } catch (Exception ignored) {}
    }
}
