package pl.sobczak.wypozyczalnia.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.sobczak.wypozyczalnia.model.Reservation;
import pl.sobczak.wypozyczalnia.model.ReservationStatus;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
        select (count(r) > 0) from Reservation r
        where r.device.id = :deviceId
          and r.status = pl.sobczak.wypozyczalnia.model.ReservationStatus.ACTIVE
          and r.toDate   >= :from
          and r.fromDate <= :to
    """)
    boolean existsActiveReservationOverlapping(@Param("deviceId") Long deviceId,
                                               @Param("from") java.time.LocalDate from,
                                               @Param("to") java.time.LocalDate to);

    Page<Reservation> findByUserId(Long userId, Pageable pageable);
    Page<Reservation> findByDeviceId(Long deviceId, Pageable pageable);
    Page<Reservation> findByStatus(ReservationStatus status, Pageable pageable);
}
