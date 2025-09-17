package pl.sobczak.wypozyczalnia.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import pl.sobczak.wypozyczalnia.dto.ReservationCreateDto;
import pl.sobczak.wypozyczalnia.model.Reservation;
import pl.sobczak.wypozyczalnia.model.ReservationStatus;
import pl.sobczak.wypozyczalnia.repository.ReservationRepository;
import pl.sobczak.wypozyczalnia.service.ReservationService;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationRepository reservationRepo;

    public ReservationController(ReservationService reservationService, ReservationRepository reservationRepo) {
        this.reservationService = reservationService;
        this.reservationRepo = reservationRepo;
    }

    @PostMapping
    public Reservation create(@Valid @RequestBody ReservationCreateDto dto) {
        return reservationService.create(dto);
    }

    @PostMapping("/{id}/cancel")
    public Reservation cancel(@PathVariable Long id) {
        return reservationService.cancel(id);
    }

    @GetMapping
    public Page<Reservation> list(@RequestParam(required = false) Long userId,
                                  @RequestParam(required = false) Long deviceId,
                                  @RequestParam(required = false) ReservationStatus status,
                                  Pageable pageable) {
        if (userId != null) return reservationRepo.findByUserId(userId, pageable);
        if (deviceId != null) return reservationRepo.findByDeviceId(deviceId, pageable);
        if (status != null) return reservationRepo.findByStatus(status, pageable);
        return reservationRepo.findAll(pageable);
    }
}
