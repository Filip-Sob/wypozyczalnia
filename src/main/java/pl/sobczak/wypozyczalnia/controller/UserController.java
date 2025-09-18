// src/main/java/pl/sobczak/wypozyczalnia/controller/UserController.java
package pl.sobczak.wypozyczalnia.controller;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.sobczak.wypozyczalnia.dto.UserRegisterDto;
import pl.sobczak.wypozyczalnia.dto.UserMeDto;
import pl.sobczak.wypozyczalnia.model.User;
import pl.sobczak.wypozyczalnia.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public UserController(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public User register(@Valid @RequestBody UserRegisterDto dto) {
        if (userRepo.existsByUsername(dto.username())) {
            throw new IllegalStateException("Nazwa użytkownika jest już zajęta");
        }
        if (userRepo.existsByEmail(dto.email())) {
            throw new IllegalStateException("Konto z tym adresem e-mail już istnieje");
        }
        User u = new User();
        u.setUsername(dto.username());
        u.setEmail(dto.email());
        u.setPassword(encoder.encode(dto.password()));
        u.setRole("ROLE_STUDENT");
        return userRepo.save(u);
    }

    // ⬇️ NOWE: kim jestem (wymaga Basic Auth)
    @GetMapping("/me")
    public UserMeDto me(Authentication auth) {
        String username = auth.getName(); // nazwa z Basic Auth
        User u = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika: " + username));
        return new UserMeDto(u.getId(), u.getUsername(), u.getEmail(), u.getRole());
    }
}
