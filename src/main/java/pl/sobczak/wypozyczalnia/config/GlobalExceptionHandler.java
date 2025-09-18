package pl.sobczak.wypozyczalnia.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException; // ⬅️ NOWY import

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

    /** 400 dla pustego/zepsutego JSON */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleUnreadable(HttpMessageNotReadableException ex, WebRequest req) {
        return ResponseEntity.badRequest().body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", "Nieprawidłowe lub puste body JSON"
        ));
    }

    /** 400 dla złego typu w ścieżce (np. /reservations/{id} z {id} nie-liczbą) */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleTypeMismatch(MethodArgumentTypeMismatchException ex, WebRequest req) {
        return ResponseEntity.badRequest().body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", "Nieprawidłowy identyfikator w ścieżce URL"
        ));
    }

    /** 404 dla nieistniejącego endpointu/zasobu */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResource(NoResourceFoundException ex, WebRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", "Nie znaleziono zasobu"
        ));
    }

    /** 409 dla reguł biznesowych/duplikatów wykrytych w kodzie */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalState(IllegalStateException ex, WebRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", ex.getMessage()
        ));
    }

    /** 409 dla naruszeń unikalności z bazy (np. unik. email/username/serialNumber) */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleConstraint(DataIntegrityViolationException ex, WebRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", "Dane naruszają ograniczenia unikalności (sprawdź nazwę użytkownika, e-mail lub numer seryjny)"
        ));
    }

    /** 500 – na czas dev wypisz typ i szczegóły, żeby łatwo namierzyć problem */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAny(Exception ex, WebRequest req) {
        ex.printStackTrace(); // pomocne w konsoli podczas dev
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "czas", Instant.now(),
                "sciezka", req.getDescription(false),
                "komunikat", "Wystąpił nieoczekiwany błąd",
                "typ", ex.getClass().getSimpleName(),
                "szczegoly", String.valueOf(ex.getMessage())
        ));
    }
}
