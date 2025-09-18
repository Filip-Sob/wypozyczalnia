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
        // sort: "pole,kierunek" np. "name,asc"
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

    /** Dodawanie urządzenia (z kontrolą duplikatu numeru seryjnego) */
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
        d.setStatus(DeviceStatus.AVAILABLE); // albo DOSTEPNY – zgodnie z Twoim enumem
        return deviceRepository.save(d);
    }
}
