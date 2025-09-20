package pl.sobczak.wypozyczalnia.device;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import pl.sobczak.wypozyczalnia.BaseIntegrationTest;
import pl.sobczak.wypozyczalnia.dto.DeviceCreateDto;
import pl.sobczak.wypozyczalnia.testsupport.JsonUtils;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

class DeviceControllerIT extends BaseIntegrationTest {

    @Test
    @WithMockUser(username = "test", roles = {"ADMIN"}) // daje ROLE_ADMIN
    @DisplayName("POST /api/devices -> 201 Created (happy path)")
    void shouldCreateDevice() throws Exception {
        DeviceCreateDto dto = new DeviceCreateDto(
                "Laptop Lenovo", "LAPTOP", "ABC123", "Sala 101"
        );

        mockMvc.perform(post("/api/devices")
                        .with(csrf()) // POST wymaga CSRF
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(JsonUtils.toJson(dto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Laptop Lenovo"))
                .andExpect(jsonPath("$.serialNumber").value("ABC123"));

    }

    @Test
    @WithMockUser(username = "test", roles = {"ADMIN"}) // ta sama rola co wymagana w endpointzie
    @DisplayName("POST /api/devices -> 409 Conflict (duplikat serialNumber)")
    void shouldReturnConflictOnDuplicateSerialNumber() throws Exception {
        DeviceCreateDto dto = new DeviceCreateDto(
                "Projektor Epson", "PROJECTOR", "XYZ999", "Sala 202"
        );

        // pierwsze dodanie -> 201
        mockMvc.perform(post("/api/devices")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(JsonUtils.toJson(dto)))
                .andExpect(status().isCreated());

        // drugie z tym samym serialNumber -> 409
        mockMvc.perform(post("/api/devices")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(JsonUtils.toJson(dto)))
                .andExpect(status().isConflict());
    }
}
