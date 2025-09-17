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

    // ✅ RĘCZNY KONSTRUKTOR – rozwiązuje błąd "not initialized in the default constructor"
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

    @Transactional
    public Loan returnLoan(Long loanId, LocalDate returnDate) {
        var loan = loanRepo.findById(loanId)
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono wypożyczenia"));
        if (loan.getStatus() != LoanStatus.ACTIVE) return loan;

        loan.setReturnDate(returnDate);
        loan.setStatus(returnDate.isAfter(loan.getDueDate()) ? LoanStatus.OVERDUE : LoanStatus.RETURNED);

        var device = loan.getDevice();
        device.setStatus(DeviceStatus.AVAILABLE);
        deviceRepo.save(device);

        return loanRepo.save(loan);
    }
}
