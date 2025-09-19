package pl.sobczak.wypozyczalnia.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    // może być null, gdy starter/bean nie jest dostępny
    @Nullable
    private final JavaMailSender mailSender;
    private final boolean realMailEnabled;

    public MailService(ObjectProvider<JavaMailSender> mailSenderProvider,
                       @Value("${spring.mail.username:}") String username) {
        this.mailSender = mailSenderProvider.getIfAvailable(); // null, jeśli beana brak
        this.realMailEnabled = (this.mailSender != null && username != null && !username.isBlank());
    }

    public void send(String to, String subject, String body, @Nullable String replyTo) {
        // fallback do logów, jeśli nie ma prawdziwego nadawcy
        if (!realMailEnabled) {
            log.info("[MAIL-LOG] to={} | subject={} | body={}", to, subject, body);
            return;
        }

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        if (replyTo != null && !replyTo.isBlank()) {
            msg.setReplyTo(replyTo);
        }
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
    }
}
