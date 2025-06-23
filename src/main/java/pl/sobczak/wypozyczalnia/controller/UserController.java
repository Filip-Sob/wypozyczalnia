package pl.sobczak.wypozyczalnia.controller;

import org.springframework.web.bind.annotation.*;
import pl.sobczak.wypozyczalnia.model.User;
import pl.sobczak.wypozyczalnia.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
