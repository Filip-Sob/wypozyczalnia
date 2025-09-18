package pl.sobczak.wypozyczalnia.repository.spec;

import org.springframework.data.jpa.domain.Specification;
import pl.sobczak.wypozyczalnia.model.Device;
import pl.sobczak.wypozyczalnia.model.DeviceStatus;

public class DeviceSpecifications {

    public static Specification<Device> hasStatus(DeviceStatus status) {
        return (root, cq, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Device> hasType(String type) {
        return (root, cq, cb) ->
                (type == null || type.isBlank())
                        ? cb.conjunction()
                        : cb.like(cb.lower(root.get("type")), "%" + type.toLowerCase() + "%");
    }

    public static Specification<Device> inLocation(String location) {
        return (root, cq, cb) ->
                (location == null || location.isBlank())
                        ? cb.conjunction()
                        : cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
    }

    /** Szukanie po nazwie i numerze seryjnym */
    public static Specification<Device> matchesQuery(String q) {
        return (root, cq, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();
            var like = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("serialNumber")), like)
            );
        };
    }
}
