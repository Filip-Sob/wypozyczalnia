package pl.sobczak.wypozyczalnia.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import pl.sobczak.wypozyczalnia.dto.DeviceCreateDto;
import pl.sobczak.wypozyczalnia.model.Device;
import pl.sobczak.wypozyczalnia.model.DeviceStatus;
import pl.sobczak.wypozyczalnia.repository.DeviceRepository;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository deviceRepo;

    public DeviceController(DeviceRepository deviceRepo) {
        this.deviceRepo = deviceRepo;
    }

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepo.findAll();
    }

    @PostMapping
    public Device create(@Valid @RequestBody DeviceCreateDto dto) {
        if (deviceRepo.existsBySerialNumber(dto.serialNumber())) {
            throw new IllegalStateException("Urządzenie o podanym numerze seryjnym już istnieje");
        }
        Device d = new Device();
        d.setName(dto.name());
        d.setType(dto.type());
        d.setSerialNumber(dto.serialNumber());
        d.setLocation(dto.location());
        d.setStatus(DeviceStatus.AVAILABLE);
        return deviceRepo.save(d);
    }
}
