package AppointmentService;

import com.sun.istack.NotNull;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

public class ChangeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer change_requestId;

    @NotNull
    private Integer appointmentId;

    @NotNull
    private Integer patientId;

    @NotNull
    private Integer doctorId;

    @NotNull
    private Enum type_request;

    private Date newDate;

    private LocalDateTime newStartTime;

    private LocalDateTime newEndTime;

    private String reason;

    private boolean is_confirmed;

    private LocalDateTime createAt;

    public Integer getChange_requestId() {
        return change_requestId;
    }

    public void setChange_requestId(Integer change_requestId) {
        this.change_requestId = change_requestId;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public Enum getType_request() {
        return type_request;
    }

    public void setType_request(Enum type_request) {
        this.type_request = type_request;
    }

    public Date getNewDate() {
        return newDate;
    }

    public void setNewDate(Date newDate) {
        this.newDate = newDate;
    }

    public LocalDateTime getNewStartTime() {
        return newStartTime;
    }

    public void setNewStartTime(LocalDateTime newStartTime) {
        this.newStartTime = newStartTime;
    }

    public LocalDateTime getNewEndTime() {
        return newEndTime;
    }

    public void setNewEndTime(LocalDateTime newEndTime) {
        this.newEndTime = newEndTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean isIs_confirmed() {
        return is_confirmed;
    }

    public void setIs_confirmed(boolean is_confirmed) {
        this.is_confirmed = is_confirmed;
    }

    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }
}
