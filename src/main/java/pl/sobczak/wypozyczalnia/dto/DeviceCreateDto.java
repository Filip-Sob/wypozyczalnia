package pl.sobczak.wypozyczalnia.dto;

import jakarta.validation.constraints.*;

public record DeviceCreateDto(
        @NotBlank(message = "Nazwa urządzenia jest wymagana")
        String name,

        @NotBlank(message = "Typ urządzenia jest wymagany")
        String type,

        @NotBlank(message = "Numer seryjny jest wymagany")
        String serialNumber,

        @NotBlank(message = "Lokalizacja jest wymagana")
        String location
) {}
