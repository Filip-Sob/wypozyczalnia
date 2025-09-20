package pl.sobczak.wypozyczalnia.loan;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.sobczak.wypozyczalnia.BaseIntegrationTest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class LoanControllerIT extends BaseIntegrationTest {

    @Test
    @DisplayName("GET /api/loans/device/{deviceId} -> 401 bez auth")
    void getLoansByDevice_unauthorized() throws Exception {
        mockMvc.perform(get("/api/loans/device/{deviceId}", 1))
                .andExpect(status().isUnauthorized());
    }
}
