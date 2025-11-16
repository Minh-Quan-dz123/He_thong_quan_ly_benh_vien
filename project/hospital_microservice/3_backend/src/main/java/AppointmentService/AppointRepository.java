package AppointmentService;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointRepository extends JpaRepository<AppointEntity, Integer> {

    public AppointEntity findByAppointmentId(Integer appointmentId);

    public List<AppointEntity> findAll();

    public List<AppointEntity> findByPatientId(Integer patientId);

    public List<AppointEntity> findByPatientId(Integer patientId, Pageable pageable);

    public List<AppointEntity> findByDoctorId(Integer doctorId);

    public List<AppointEntity> findByDoctorId(Integer doctorId, Pageable pageable);

    public AppointEntity create(AppointEntity appointEntity);

    public AppointEntity update(AppointEntity appointEntity);
}
