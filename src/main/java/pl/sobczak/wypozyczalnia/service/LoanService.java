package pl.sobczak.wypozyczalnia.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sobczak.wypozyczalnia.dto.LoanCreateDto;
import pl.sobczak.wypozyczalnia.model.Device;
import pl.sobczak.wypozyczalnia.model.DeviceStatus;
import pl.sobczak.wypozyczalnia.model.Loan;
import pl.sobczak.wypozyczalnia.model.LoanStatus;
import pl.sobczak.wypozyczalnia.repository.DeviceRepository;
import pl.sobczak.wypozyczalnia.repository.LoanRepository;
import pl.sobczak.wypozyczalnia.repository.UserRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class LoanService {

    private final LoanRepository loanRepo;
    private final DeviceRepository deviceRepo;
    private final UserRepository userRepo;

    public LoanService(LoanRepository loanRepo, DeviceRepository deviceRepo, UserRepository userRepo) {
        this.loanRepo = loanRepo;
        this.deviceRepo = deviceRepo;
        this.userRepo = userRepo;
    }

    private static final int MAX_DNI_WYPOZYCZENIA = 14;

    @Transactional
    public Loan create(LoanCreateDto dto) {
        Device device = deviceRepo.findById(dto.deviceId())
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono urządzenia"));
        var user = userRepo.findById(dto.userId())
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono użytkownika"));

        if (device.getStatus() != DeviceStatus.AVAILABLE) {
            throw new IllegalStateException("Sprzęt niedostępny do wypożyczenia");
        }

        long dni = ChronoUnit.DAYS.between(dto.startDate(), dto.dueDate());
        if (dni <= 0) throw new IllegalStateException("Termin zwrotu musi być po dacie rozpoczęcia");
        if (dni > MAX_DNI_WYPOZYCZENIA) {
            throw new IllegalStateException("Maksymalny czas wypożyczenia to " + MAX_DNI_WYPOZYCZENIA + " dni");
        }

        var loan = new Loan();
        loan.setDevice(device);
        loan.setUser(user);
        loan.setStartDate(dto.startDate());
        loan.setDueDate(dto.dueDate());
        loan.setStatus(LoanStatus.ACTIVE);

        device.setStatus(DeviceStatus.LOANED);
        deviceRepo.save(device);

        return loanRepo.save(loan);
    }

    /** Zwrot z notatką i flagą uszkodzenia; returnDate opcjonalny (gdy null → dziś). */
    @Transactional
    public Loan returnLoan(Long loanId, LocalDate returnDate, String note, boolean damaged) {
        var loan = loanRepo.findById(loanId)
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono wypożyczenia"));

        if (loan.getReturnDate() != null || loan.getStatus() == LoanStatus.RETURNED || loan.getStatus() == LoanStatus.OVERDUE) {
            throw new IllegalStateException("To wypożyczenie zostało już zwrócone.");
        }
        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new IllegalStateException("Wypożyczenie nie jest aktywne – nie można go zwrócić.");
        }

        LocalDate realReturn = (returnDate != null) ? returnDate : LocalDate.now();
        loan.setReturnDate(realReturn);
        if (note != null && !note.isBlank()) {
            loan.setReturnNote(note);
        }
        loan.setDamageReported(damaged);

        // status wypożyczenia
        if (loan.getDueDate() != null && realReturn.isAfter(loan.getDueDate())) {
            loan.setStatus(LoanStatus.OVERDUE);
        } else {
            loan.setStatus(LoanStatus.RETURNED);
        }

        // status urządzenia po zwrocie
        var device = loan.getDevice();
        device.setStatus(damaged ? DeviceStatus.DAMAGED : DeviceStatus.AVAILABLE);
        deviceRepo.save(device);

        return loanRepo.save(loan);
    }
}
