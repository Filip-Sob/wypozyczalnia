package pl.sobczak.wypozyczalnia.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ReservationStatus {
    ACTIVE("AKTYWNA"),
    CANCELED("ANULOWANA"),
    EXPIRED("WYGASŁA"),
    FULFILLED("ZREALIZOWANA");

    private final String pl;

    ReservationStatus(String pl) { this.pl = pl; }

    @JsonValue
    public String toJson() { return pl; }

    @JsonCreator
    public static ReservationStatus fromJson(String value) {
        if (value == null) return null;
        String v = value.trim();
        for (ReservationStatus s : values()) {
            if (s.pl.equalsIgnoreCase(v) || s.name().equalsIgnoreCase(v)) return s;
        }
        throw new IllegalArgumentException("Nieznany status rezerwacji: " + value);
    }

    public String getPl() { return pl; }
}
