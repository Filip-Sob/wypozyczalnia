package pl.sobczak.wypozyczalnia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sobczak.wypozyczalnia.model.Device;

public interface DeviceRepository extends JpaRepository<Device, Long> {
}
