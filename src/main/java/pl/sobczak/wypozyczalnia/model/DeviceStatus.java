package pl.sobczak.wypozyczalnia.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DeviceStatus {
    AVAILABLE("DOSTĘPNY"),
    RESERVED("ZAREZERWOWANY"),
    LOANED("WYPOŻYCZONY"),
    MAINTENANCE("SERWIS"),
    LOST("ZGUBIONY"),
    DAMAGED("USZKODZONY");

    private final String pl;

    DeviceStatus(String pl) { this.pl = pl; }

    /** Co pokażemy w JSON (PL) */
    @JsonValue
    public String toJson() { return pl; }

    /** Przyjmuj w JSON zarówno PL jak i EN */
    @JsonCreator
    public static DeviceStatus fromJson(String value) {
        if (value == null) return null;
        String v = value.trim();
        for (DeviceStatus s : values()) {
            if (s.pl.equalsIgnoreCase(v) || s.name().equalsIgnoreCase(v)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Nieznany status: " + value);
    }

    public String getPl() { return pl; }
}
