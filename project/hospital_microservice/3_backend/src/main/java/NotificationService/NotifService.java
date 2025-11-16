package NotificationService;

import sys.UserEntity;

import java.util.List;

public interface NotifService {

    public NotifEntity fetchNotificationById(Integer id);

    public List<NotifEntity> fetchNotificationByUserId(Integer userId);

    public NotifEntity createNotification(NotifEntity notifEntity);

    public void deleteNotification(Integer id);

    public List<UserEntity> findByRole(Enum role);

}
