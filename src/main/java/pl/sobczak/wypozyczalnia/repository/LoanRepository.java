package pl.sobczak.wypozyczalnia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sobczak.wypozyczalnia.model.Loan;
import pl.sobczak.wypozyczalnia.model.LoanStatus;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
    List<Loan> findByDeviceIdAndStatus(Long deviceId, LoanStatus status);
}
