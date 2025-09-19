package pl.sobczak.wypozyczalnia.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public record LoanReturnDto(
        @JsonFormat(pattern = "yyyy-MM-dd") LocalDate returnDate, // opcjonalnie
        String note,                                              // opcjonalnie
        Boolean damaged                                           // opcjonalnie; null -> false
) { }
