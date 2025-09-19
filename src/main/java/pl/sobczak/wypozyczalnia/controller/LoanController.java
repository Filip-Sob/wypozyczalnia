package pl.sobczak.wypozyczalnia.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import pl.sobczak.wypozyczalnia.dto.LoanCreateDto;
import pl.sobczak.wypozyczalnia.model.Loan;
import pl.sobczak.wypozyczalnia.repository.LoanRepository;
import pl.sobczak.wypozyczalnia.service.LoanService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;
    private final LoanRepository loanRepo;

    public LoanController(LoanService loanService, LoanRepository loanRepo) {
        this.loanService = loanService;
        this.loanRepo = loanRepo;
    }

    @PostMapping
    public Loan create(@Valid @RequestBody LoanCreateDto dto) {
        return loanService.create(dto);
    }

    /** Zwrot z opcjonalną datą i notatką oraz flagą uszkodzenia. */
    @PostMapping("/{id}/return")
    public Loan returnLoan(@PathVariable Long id,
                           @RequestParam(required = false)
                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnDate,
                           @RequestParam(required = false) String note,
                           @RequestParam(defaultValue = "false") boolean damaged) {
        return loanService.returnLoan(id, returnDate, note, damaged);
    }

    @GetMapping
    public Page<Loan> list(Pageable pageable) {
        return loanRepo.findAll(pageable);
    }
}
