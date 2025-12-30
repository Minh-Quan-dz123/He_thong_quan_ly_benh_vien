package AppointmentService;

import java.util.List;

public interface AppointService {

    public AppointEntity findByAppointmentId(Integer appointmentId);

    public List<AppointEntity> findByDoctorId(Integer doctorId);

    public List<AppointEntity> findByDoctorId(Integer doctorId, Integer limit);

    public List<AppointEntity> findByPatientId(Integer patientId);

    public List<AppointEntity> findByPatientId(Integer patientId, Integer limit);

    public List<AppointEntity> findAll();

    public AppointEntity create(AppointEntity appointEntity);

    public AppointEntity update(AppointEntity appointEntity);
}
