package AppointmentService;

import com.sun.istack.NotNull;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class AppointEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;

    @NotNull
    private Integer patientId;

    @NotNull
    private Integer doctorId;

    @NotNull
    private Date date;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    @NotNull
    private LocalDateTime createAt;

    private String note;

    private String room;

    @NotNull
    private Enum status;

    @NotNull
    private Enum change_request;

    private Integer change_requestId;
}
