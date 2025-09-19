package pl.sobczak.wypozyczalnia.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.sobczak.wypozyczalnia.model.Loan;
import pl.sobczak.wypozyczalnia.model.LoanStatus;
import pl.sobczak.wypozyczalnia.repository.LoanRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class LoanReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(LoanReminderScheduler.class);

    private final LoanRepository loanRepo;
    private final MailService mailService;
    private final boolean enabled;
    private final List<Integer> daysAhead;

    public LoanReminderScheduler(
            LoanRepository loanRepo,
            MailService mailService,
            @Value("${app.reminders.enabled:true}") boolean enabled,
            @Value("${app.reminders.days-ahead:2,1,0}") String daysAheadCsv
    ) {
        this.loanRepo = loanRepo;
        this.mailService = mailService;
        this.enabled = enabled;
        this.daysAhead = Arrays.stream(daysAheadCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(Integer::parseInt)
                .toList();
    }

    /** Raz dziennie o 08:00 */
    @Scheduled(cron = "0 * * * * *")
    public void sendReminders() {
        if (!enabled) {
            log.debug("Reminders disabled (app.reminders.enabled=false)");
            return;
        }

        LocalDate today = LocalDate.now();

        for (Integer d : daysAhead) {
            LocalDate target = today.plusDays(d);
            List<Loan> loans = loanRepo.findByStatusAndReturnDateIsNullAndDueDate(LoanStatus.ACTIVE, target);

            for (Loan loan : loans) {
                var user = loan.getUser();
                var device = loan.getDevice();

                String when = (d == 0) ? "dzisiaj" : (d == 1) ? "jutro" : ("za " + d + " dni");

                String to = user.getEmail();
                String subject = "Przypomnienie: zwrot sprzętu \"" + device.getName() + "\" " + when + " (" + loan.getDueDate() + ")";
                String body = """
                        Cześć %s,

                        przypominamy o zbliżającym się terminie zwrotu sprzętu:

                        • Urządzenie: %s
                        • Numer seryjny: %s
                        • Lokalizacja: %s
                        • Termin zwrotu: %s

                        Prosimy o zwrot w terminie. W razie problemów skontaktuj się z opiekunem.

                        Pozdrawiamy,
                        Wypożyczalnia Uczelniana
                        """.formatted(user.getUsername(),
                        device.getName(),
                        device.getSerialNumber(),
                        device.getLocation(),
                        loan.getDueDate());

                try {
                    mailService.send(to, subject, body, null);
                    log.info("Wysłano przypomnienie do {} (loan #{}, due {})", to, loan.getId(), loan.getDueDate());
                } catch (Exception ex) {
                    log.error("Błąd wysyłki maila (loan #{}): {}", loan.getId(), ex.getMessage(), ex);
                }
            }
        }
    }
}
