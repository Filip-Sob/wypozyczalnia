// src/main/java/pl/sobczak/wypozyczalnia/service/CustomUserDetailsService.java
package pl.sobczak.wypozyczalnia.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.sobczak.wypozyczalnia.model.User;
import pl.sobczak.wypozyczalnia.repository.UserRepository;
import pl.sobczak.wypozyczalnia.security.CustomUserDetails;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono użytkownika: " + username));
        return new CustomUserDetails(user);
    }
}
