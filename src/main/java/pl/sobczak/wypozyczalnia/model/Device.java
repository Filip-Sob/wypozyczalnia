package pl.sobczak.wypozyczalnia.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "devices",
        uniqueConstraints = @UniqueConstraint(name = "uk_devices_serial", columnNames = "serial_number")
)
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(name = "serial_number", nullable = false)
    private String serialNumber;

    @Column(nullable = false)
    private String location;

    // @Enumerated(EnumType.STRING)
    private DeviceStatus status = DeviceStatus.AVAILABLE; // domyślnie dostępny

    // --- gettery/settery ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public DeviceStatus getStatus() { return status; }
    public void setStatus(DeviceStatus status) { this.status = status; }
}
