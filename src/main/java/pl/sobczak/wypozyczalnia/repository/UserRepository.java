package pl.sobczak.wypozyczalnia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sobczak.wypozyczalnia.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // ⬅️ potrzebne dla logowania
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
