package pl.sobczak.wypozyczalnia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sobczak.wypozyczalnia.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
