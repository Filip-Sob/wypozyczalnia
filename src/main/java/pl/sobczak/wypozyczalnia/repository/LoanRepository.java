package pl.sobczak.wypozyczalnia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.sobczak.wypozyczalnia.model.Loan;
import pl.sobczak.wypozyczalnia.model.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByUserId(Long userId);

    List<Loan> findByDeviceIdAndStatus(Long deviceId, LoanStatus status);

    Page<Loan> findByDeviceIdOrderByStartDateDesc(Long deviceId, Pageable pageable);

    @Query("""
        select (count(l) > 0) from Loan l
        where l.device.id = :deviceId
          and l.status = :active
          and l.dueDate >= :from
          and l.startDate <= :to
    """)
    boolean existsActiveLoanOverlapping(@Param("deviceId") Long deviceId,
                                        @Param("from") LocalDate from,
                                        @Param("to") LocalDate to,
                                        @Param("active") LoanStatus active);

    // 🔹 używane przez scheduler przypomnień
    List<Loan> findByStatusAndReturnDateIsNullAndDueDate(LoanStatus status, LocalDate dueDate);
}
