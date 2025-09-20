package pl.sobczak.wypozyczalnia.testsupport;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/** Helper do budowy nagłówka Authorization: Basic ... */
public final class AuthUtils {
    private AuthUtils() {}

    // NAZWA I SYGNATURA MUSZĄ BYĆ IDENTYCZNE:
    public static String basicAuthHeader(String username, String password) {
        String token = username + ":" + password;
        String base64 = Base64.getEncoder().encodeToString(token.getBytes(StandardCharsets.UTF_8));
        return "Basic " + base64;
    }
}
