package pl.sobczak.wypozyczalnia.config;

import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex, WebRequest req) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        f -> f.getField(),
                        f -> f.getDefaultMessage(),
                        (a, b) -> a
                ));
        return ResponseEntity.badRequest().body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", "Walidacja nie powiodła się",
                "bledy", errors
        ));
    }

    // ⬇️ NOWE: czytelny 400 dla pustego/zepsutego JSON
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleUnreadable(HttpMessageNotReadableException ex, WebRequest req) {
        return ResponseEntity.badRequest().body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", "Nieprawidłowe lub puste body JSON"
        ));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalState(IllegalStateException ex, WebRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", ex.getMessage()
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAny(Exception ex, WebRequest req) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", "Wystąpił nieoczekiwany błąd"
        ));
    }
}
