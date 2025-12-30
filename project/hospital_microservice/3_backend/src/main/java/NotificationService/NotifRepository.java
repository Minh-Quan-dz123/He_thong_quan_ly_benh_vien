package NotificationService;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotifRepository extends JpaRepository<NotifEntity,Integer> {

    public NotifEntity findByNotificationId(Integer notificationId);

    public List<NotifEntity> findAll();

    public List<NotifEntity> findByUserId(Integer userId);

    public NotifEntity create(NotifEntity notifEntity);

    public NotifEntity update(NotifEntity notifEntity);

    public void deleteByNotificationId(Integer notificationId);
}
