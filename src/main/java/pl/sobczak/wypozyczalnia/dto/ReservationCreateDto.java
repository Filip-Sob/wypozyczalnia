package pl.sobczak.wypozyczalnia.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ReservationCreateDto(
        @NotNull(message = "Identyfikator urządzenia jest wymagany")
        Long deviceId,

        @NotNull(message = "Identyfikator użytkownika jest wymagany")
        Long userId,

        @NotNull(message = "Data od jest wymagana")
        LocalDate fromDate,

        @NotNull(message = "Data do jest wymagana")
        LocalDate toDate
) {}
