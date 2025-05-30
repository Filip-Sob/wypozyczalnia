package pl.sobczak.wypozyczalnia.controller;

import org.springframework.web.bind.annotation.*;
import pl.sobczak.wypozyczalnia.model.Device;
import pl.sobczak.wypozyczalnia.repository.DeviceRepository;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository deviceRepository;

    public DeviceController(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @PostMapping
    public Device createDevice(@RequestBody Device device) {
        return deviceRepository.save(device);
    }
}
