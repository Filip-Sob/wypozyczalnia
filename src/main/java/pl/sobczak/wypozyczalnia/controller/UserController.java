package pl.sobczak.wypozyczalnia.controller;

import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.sobczak.wypozyczalnia.dto.UserRegisterDto;
import pl.sobczak.wypozyczalnia.model.User;
import pl.sobczak.wypozyczalnia.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    // ✅ Ręczny konstruktor – eliminuje błąd "not initialized"
    public UserController(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public User register(@Valid @RequestBody UserRegisterDto dto) {
        User u = new User();
        u.setUsername(dto.username());
        u.setEmail(dto.email());
        u.setPassword(encoder.encode(dto.password()));
        u.setRole("ROLE_STUDENT"); // domyślna rola dla nowego użytkownika
        return userRepo.save(u);
    }
}
