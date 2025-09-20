package pl.sobczak.wypozyczalnia.reservation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.sobczak.wypozyczalnia.BaseIntegrationTest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ReservationControllerIT extends BaseIntegrationTest {

    @Test
    @DisplayName("POST /api/reservations -> 401 bez auth")
    void postReservations_unauthorized() throws Exception {
        mockMvc.perform(post("/api/reservations"))
                .andExpect(status().isUnauthorized());
    }
}
