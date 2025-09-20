// src/main/java/pl/sobczak/wypozyczalnia/controller/DeviceController.java
package pl.sobczak.wypozyczalnia.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

import pl.sobczak.wypozyczalnia.dto.DeviceCreateDto;
import pl.sobczak.wypozyczalnia.model.Device;
import pl.sobczak.wypozyczalnia.model.DeviceStatus;
import pl.sobczak.wypozyczalnia.repository.DeviceRepository;
import pl.sobczak.wypozyczalnia.repository.spec.DeviceSpecifications;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository deviceRepository;

    public DeviceController(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    /** Lista urządzeń z filtrami: status, type, location, q oraz paginacją/sortowaniem */
    @GetMapping
    public Page<Device> search(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        Sort sortObj;
        try {
            var parts = sort.split(",", 2);
            var field = parts[0];
            var dir = (parts.length > 1 ? parts[1] : "desc").toLowerCase();
            sortObj = "asc".equals(dir) ? Sort.by(field).ascending() : Sort.by(field).descending();
        } catch (Exception e) {
            sortObj = Sort.by("id").descending();
        }
        Pageable pageable = PageRequest.of(page, size, sortObj);

        DeviceStatus st = null;
        if (status != null && !status.isBlank()) {
            try {
                st = DeviceStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalStateException("Nieprawidłowy status: " + status);
            }
        }

        Specification<Device> spec = Specification.allOf(
                DeviceSpecifications.hasStatus(st),
                DeviceSpecifications.hasType(type),
                DeviceSpecifications.inLocation(location),
                DeviceSpecifications.matchesQuery(query)
        );

        return deviceRepository.findAll(spec, pageable);
    }

    /** Dodawanie urządzenia */
    @PostMapping
    public Device create(@Valid @RequestBody DeviceCreateDto dto) {
        if (deviceRepository.existsBySerialNumber(dto.serialNumber())) {
            throw new IllegalStateException("Urządzenie o podanym numerze seryjnym już istnieje");
        }
        Device d = new Device();
        d.setName(dto.name());
        d.setType(dto.type());
        d.setSerialNumber(dto.serialNumber());
        d.setLocation(dto.location());
        d.setStatus(DeviceStatus.AVAILABLE);
        return deviceRepository.save(d);
    }

    /** Pobranie szczegółów urządzenia */
    @GetMapping("/{id}")
    public Device getById(@PathVariable Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Nie znaleziono urządzenia id=" + id));
    }

    /** Aktualizacja urządzenia */
    @PutMapping("/{id}")
    public Device update(@PathVariable Long id, @Valid @RequestBody DeviceCreateDto dto) {
        Device d = deviceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Nie znaleziono urządzenia id=" + id));

        d.setName(dto.name());
        d.setType(dto.type());
        d.setSerialNumber(dto.serialNumber());
        d.setLocation(dto.location());
        // status nie jest w DTO, więc zostaje stary
        return deviceRepository.save(d);
    }

    /** Usuwanie urządzenia */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!deviceRepository.existsById(id)) {
            throw new NoSuchElementException("Nie znaleziono urządzenia id=" + id);
        }
        deviceRepository.deleteById(id);
    }
}
