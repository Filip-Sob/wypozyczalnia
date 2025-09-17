package pl.sobczak.wypozyczalnia.dto;

import jakarta.validation.constraints.*;

public record UserRegisterDto(
        @NotBlank(message = "Nazwa użytkownika jest wymagana")
        String username,

        @NotBlank(message = "E-mail jest wymagany")
        @Email(message = "Podaj prawidłowy adres e-mail")
        String email,

        @NotBlank(message = "Hasło jest wymagane")
        @Size(min = 8, message = "Hasło musi mieć co najmniej 8 znaków")
        String password
) {}
