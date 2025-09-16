package pl.sobczak.wypozyczalnia.model;

public enum LoanStatus {
    ACTIVE,      // wypożyczenie trwa
    RETURNED,    // zwrócone w terminie
    OVERDUE,     // przeterminowane
    CANCELED     // anulowane
}
