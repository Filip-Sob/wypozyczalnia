package pl.sobczak.wypozyczalnia.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sobczak.wypozyczalnia.dto.ReservationCreateDto;
import pl.sobczak.wypozyczalnia.model.*;
import pl.sobczak.wypozyczalnia.repository.*;

import java.time.temporal.ChronoUnit;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepo;
    private final DeviceRepository deviceRepo;
    private final UserRepository userRepo;
    private final LoanRepository loanRepo;

    public ReservationService(ReservationRepository reservationRepo,
                              DeviceRepository deviceRepo,
                              UserRepository userRepo,
                              LoanRepository loanRepo) {
        this.reservationRepo = reservationRepo;
        this.deviceRepo = deviceRepo;
        this.userRepo = userRepo;
        this.loanRepo = loanRepo;
    }

    @Transactional
    public Reservation create(ReservationCreateDto dto) {
        var device = deviceRepo.findById(dto.deviceId())
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono urządzenia"));
        var user = userRepo.findById(dto.userId())
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono użytkownika"));

        if (dto.toDate().isBefore(dto.fromDate()) || dto.toDate().isEqual(dto.fromDate()))
            throw new IllegalStateException("Data 'do' musi być po dacie 'od'");

        long dni = ChronoUnit.DAYS.between(dto.fromDate(), dto.toDate());
        if (dni > 30) throw new IllegalStateException("Maksymalny czas rezerwacji to 30 dni");

        // kolizja z inną aktywną rezerwacją
        boolean overlapsReservation = reservationRepo
                .existsActiveReservationOverlapping(device.getId(), dto.fromDate(), dto.toDate());
        if (overlapsReservation) throw new IllegalStateException("Istnieje już rezerwacja na ten termin");

        // kolizja z aktywnym wypożyczeniem w tym okresie
        boolean overlapsLoan = loanRepo
                .existsActiveLoanOverlapping(device.getId(), dto.fromDate(), dto.toDate(), LoanStatus.ACTIVE);
        if (overlapsLoan) throw new IllegalStateException("W wybranym okresie sprzęt jest wypożyczony");

        var r = new Reservation();
        r.setDevice(device);
        r.setUser(user);
        r.setFromDate(dto.fromDate());
        r.setToDate(dto.toDate());
        r.setStatus(ReservationStatus.ACTIVE);

        // jeśli sprzęt jest dostępny, oznacz jako zarezerwowany (prosta wersja)
        if (device.getStatus() == DeviceStatus.AVAILABLE) {
            device.setStatus(DeviceStatus.RESERVED);
            deviceRepo.save(device);
        }

        return reservationRepo.save(r);
    }

    @Transactional
    public Reservation cancel(Long id) {
        var r = reservationRepo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono rezerwacji"));
        if (r.getStatus() != ReservationStatus.ACTIVE) return r;
        r.setStatus(ReservationStatus.CANCELED);

        // jeśli po anulacji urządzenie nie ma już innych aktywnych rezerwacji -> udostępnij
        boolean hasOther = reservationRepo
                .existsActiveReservationOverlapping(r.getDevice().getId(), r.getFromDate(), r.getToDate());
        if (!hasOther && r.getDevice().getStatus() == DeviceStatus.RESERVED) {
            r.getDevice().setStatus(DeviceStatus.AVAILABLE);
            deviceRepo.save(r.getDevice());
        }
        return reservationRepo.save(r);
    }
}
