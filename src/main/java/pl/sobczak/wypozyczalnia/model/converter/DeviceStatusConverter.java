// src/main/java/pl/sobczak/wypozyczalnia/model/converter/DeviceStatusConverter.java
package pl.sobczak.wypozyczalnia.model.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import pl.sobczak.wypozyczalnia.model.DeviceStatus;

import java.text.Normalizer;
import java.util.Arrays;

@Converter(autoApply = true)
public class DeviceStatusConverter implements AttributeConverter<DeviceStatus, String> {

    @Override
    public String convertToDatabaseColumn(DeviceStatus attribute) {
        return attribute == null ? null : attribute.name(); // zapisuj w DB nazwę stałej enuma
    }

    @Override
    public DeviceStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;

        // Ujednolicenie (wielkość liter, usunięcie polskich znaków)
        String s = normalize(dbData);

        // Mapa PL/EN -> stałe enuma (pierwsze trzy wiemy, że istnieją)
        if (s.equals("AVAILABLE") || s.equals("DOSTEPNY")) {
            return DeviceStatus.valueOf("AVAILABLE");
        }
        if (s.equals("RESERVED") || s.equals("ZAREZERWOWANY")) {
            return DeviceStatus.valueOf("RESERVED");
        }
        if (s.equals("LOANED") || s.equals("WYPOZYCZONY")) {
            return DeviceStatus.valueOf("LOANED");
        }

        // SERWIS – spróbuj różnych możliwych nazw w Twoim enumie:
        if (s.equals("SERVICE") || s.equals("SERWIS") || s.equals("SERWISOWANY")) {
            return pickExisting("SERVICE", "IN_SERVICE", "SERVICED", "MAINTENANCE");
        }

        // USZKODZONY
        if (s.equals("DAMAGED") || s.equals("ZNISZCZONY")) {
            return DeviceStatus.valueOf("DAMAGED");
        }

        // Spróbuj bez mapy – może i tak jest poprawna nazwa stałej
        try {
            return DeviceStatus.valueOf(s);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Nieznany status w DB: " + dbData);
        }
    }

    private static String normalize(String input) {
        String n = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", ""); // usuń diakrytyki (Ę->E, Ż->Z)
        return n.trim().toUpperCase();
    }

    private static DeviceStatus pickExisting(String... candidates) {
        for (String c : candidates) {
            try { return DeviceStatus.valueOf(c); }
            catch (IllegalArgumentException ignored) {}
        }
        throw new IllegalArgumentException("Brak pasującej stałej enuma dla: " + Arrays.toString(candidates));
    }
}
