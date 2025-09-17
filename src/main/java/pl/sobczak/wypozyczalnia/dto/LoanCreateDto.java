package pl.sobczak.wypozyczalnia.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record LoanCreateDto(
        @NotNull(message = "Identyfikator urządzenia jest wymagany")
        Long deviceId,
        @NotNull(message = "Identyfikator użytkownika jest wymagany")
        Long userId,
        @NotNull(message = "Data rozpoczęcia jest wymagana")
        LocalDate startDate,
        @NotNull(message = "Termin zwrotu jest wymagany")
        LocalDate dueDate
) {}
